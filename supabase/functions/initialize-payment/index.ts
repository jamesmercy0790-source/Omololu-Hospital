import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const allowed = ["https://omololuhospital.com", "https://www.omololuhospital.com"];
const PAYMENT_TIMEOUT_SECONDS = 30 * 60;
let timeoutConfiguration: Promise<void> | null = null;

function headersFor(origin: string | null) {
  return {
    "Access-Control-Allow-Origin":
      origin && allowed.includes(origin) ? origin : "https://omololuhospital.com",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

const out = (body: unknown, status = 200, headers: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

async function ensurePaystackSessionTimeout(secret: string) {
  if (!timeoutConfiguration) {
    timeoutConfiguration = (async () => {
      const headers = {
        Authorization: "Bearer " + secret,
        "Content-Type": "application/json",
      };
      const currentResponse = await fetch(
        "https://api.paystack.co/integration/payment_session_timeout",
        { headers },
      );
      const current = await currentResponse.json().catch(() => ({}));
      if (!currentResponse.ok || current.status !== true) {
        throw new Error("Could not verify the Paystack payment timeout.");
      }
      if (Number(current.data?.payment_session_timeout) === PAYMENT_TIMEOUT_SECONDS) {
        return;
      }

      const updateResponse = await fetch(
        "https://api.paystack.co/integration/payment_session_timeout",
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ timeout: PAYMENT_TIMEOUT_SECONDS }),
        },
      );
      const updated = await updateResponse.json().catch(() => ({}));
      if (
        !updateResponse.ok ||
        updated.status !== true ||
        Number(updated.data?.payment_session_timeout) !== PAYMENT_TIMEOUT_SECONDS
      ) {
        throw new Error("Could not set the Paystack checkout timeout to 30 minutes.");
      }
    })().catch((error) => {
      timeoutConfiguration = null;
      throw error;
    });
  }
  await timeoutConfiguration;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = headersFor(origin);
  if (origin && !allowed.includes(origin)) return out({ error: "Origin not allowed" }, 403, headers);
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return out({ error: "Method not allowed" }, 405, headers);

  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization) return out({ error: "Sign in required" }, 401, headers);

    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const secret = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!secret) return out({ error: "Online payments are temporarily unavailable." }, 503, headers);

    const auth = createClient(url, anon, {
      global: { headers: { Authorization: authorization } },
    });
    const { data: { user }, error: authError } = await auth.auth.getUser();
    if (authError || !user) return out({ error: "Sign in required" }, 401, headers);

    const body = await req.json().catch(() => null);
    const id = body?.appointment_id;
    if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) {
      return out({ error: "Invalid appointment" }, 400, headers);
    }

    const db = createClient(url, service);
    const { data: appointment, error: appointmentError } = await db
      .from("appointments")
      .select("id, patient_id, amount, status, payment_status, created_at")
      .eq("id", id)
      .eq("patient_id", user.id)
      .maybeSingle();

    if (appointmentError || !appointment) {
      return out({ error: "Appointment not found." }, 404, headers);
    }
    if (appointment.payment_status === "paid") {
      return out({ status: "paid", message: "This appointment is already paid." }, 409, headers);
    }
    if (["cancelled", "completed"].includes(appointment.status)) {
      return out({ error: "This appointment cannot be paid for." }, 409, headers);
    }

    const { data: existing, error: existingError } = await db
      .from("payments")
      .select("reference, paystack_response, created_at")
      .eq("appointment_id", id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingError) {
      return out({ error: "Could not check the payment session. Please refresh and try again." }, 500, headers);
    }

    const expiresAt = existing
      ? new Date(existing.created_at).getTime() + PAYMENT_TIMEOUT_SECONDS * 1000
      : new Date(appointment.created_at).getTime() + PAYMENT_TIMEOUT_SECONDS * 1000;

    if (Date.now() >= expiresAt) {
      await db.rpc("expire_unpaid_appointments");
      return out(
        { error: "The 30-minute payment window has expired. This appointment was cancelled; please book again." },
        409,
        headers,
      );
    }

    // Paystack's payment-session timeout is an integration setting in seconds.
    // Ensure each new hosted checkout is restricted to the same 30-minute window.
    try {
      await ensurePaystackSessionTimeout(secret);
    } catch (error) {
      return out(
        { error: error instanceof Error ? error.message : "Could not configure secure payment timeout." },
        503,
        headers,
      );
    }

    if (existing) {
      const savedUrl = (existing.paystack_response as any)?.data?.authorization_url;
      if (savedUrl) {
        return out({ authorization_url: savedUrl, reference: existing.reference, reused: true }, 200, headers);
      }
      return out(
        { error: "A payment attempt is already being prepared. Wait a moment before trying again." },
        409,
        headers,
      );
    }

    const amount = Number(appointment.amount);
    const kobo = Math.round(amount * 100);
    if (!Number.isFinite(kobo) || kobo <= 0) {
      return out({ error: "Invalid appointment fee." }, 400, headers);
    }

    const reference = "OMH-" + crypto.randomUUID();
    const { error: insertError } = await db.from("payments").insert({
      appointment_id: id,
      patient_id: user.id,
      reference,
      amount,
      currency: "NGN",
      status: "pending",
      paystack_response: { state: "initializing" },
    });
    if (insertError) {
      return out({ error: "A payment attempt already exists. Refresh the appointment list in a moment." }, 409, headers);
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: "Bearer " + secret, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        amount: kobo,
        currency: "NGN",
        reference,
        callback_url:
          body?.platform === "web"
            ? "https://www.omololuhospital.com/appointments/payment-return"
            : "https://hlhbrkwsrhvbibhovnge.supabase.co/functions/v1/paystack-payment-callback",
        metadata: { appointment_id: id, patient_id: user.id },
      }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.status !== true || typeof result.data?.authorization_url !== "string") {
      await db
        .from("payments")
        .update({
          status: "failed",
          paystack_response: { state: "initialization_failed" },
          updated_at: new Date().toISOString(),
        })
        .eq("reference", reference)
        .eq("status", "pending");
      return out({ error: "Paystack could not start the payment. Please try again." }, 502, headers);
    }

    const { error: saveError } = await db
      .from("payments")
      .update({ paystack_response: result, updated_at: new Date().toISOString() })
      .eq("reference", reference)
      .eq("status", "pending");
    if (saveError) {
      return out({ error: "Payment session could not be saved. Contact the hospital before retrying." }, 500, headers);
    }

    await db
      .from("appointments")
      .update({ payment_reference: reference })
      .eq("id", id)
      .eq("patient_id", user.id)
      .eq("payment_status", "pending");

    return out({ authorization_url: result.data.authorization_url, reference }, 200, headers);
  } catch {
    return out(
      { error: "Unable to start payment. Please try again." },
      500,
      headersFor(req.headers.get("origin")),
    );
  }
});
