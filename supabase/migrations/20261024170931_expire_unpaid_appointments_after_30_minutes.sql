-- 30-minute expiry for pending hospital bookings and payment attempts.
-- Payments use the timestamp of the pending Paystack attempt; bookings with no
-- payment attempt expire 30 minutes after creation. The Edge Function also
-- configures Paystack's integration payment-session timeout to 1800 seconds.

create or replace function public.expire_unpaid_appointments()
returns integer
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_appointment record;
  v_expired_count integer := 0;
begin
  for v_appointment in
    select a.id, a.patient_id
    from public.appointments a
    where a.status in ('pending', 'confirmed')
      and a.payment_status = 'pending'
      and not exists (
        select 1 from public.payments p
        where p.appointment_id = a.id and p.status = 'success'
      )
      and (
        exists (
          select 1 from public.payments p
          where p.appointment_id = a.id
            and p.status = 'pending'
            and p.created_at <= pg_catalog.now() - interval '30 minutes'
        )
        or (
          not exists (
            select 1 from public.payments p
            where p.appointment_id = a.id and p.status = 'pending'
          )
          and a.created_at <= pg_catalog.now() - interval '30 minutes'
        )
      )
    order by a.created_at
    for update of a skip locked
  loop
    update public.payments p
    set status = 'failed',
        paystack_response = coalesce(p.paystack_response, '{}'::jsonb)
          || pg_catalog.jsonb_build_object(
            'state', 'expired',
            'reason', 'payment_not_completed_within_30_minutes'
          ),
        updated_at = pg_catalog.now()
    where p.appointment_id = v_appointment.id
      and p.status = 'pending';

    update public.appointments
    set status = 'cancelled',
        payment_status = 'failed',
        updated_at = pg_catalog.now()
    where id = v_appointment.id
      and status in ('pending', 'confirmed')
      and payment_status = 'pending';

    insert into public.notifications (
      user_id, title, body, type, related_appointment_id
    )
    select
      v_appointment.patient_id,
      'Payment failed',
      'Your payment session expired after 30 minutes and the appointment was cancelled. Please book another appointment if you still need a visit.',
      'payment',
      v_appointment.id
    where not exists (
      select 1 from public.notifications n
      where n.user_id = v_appointment.patient_id
        and n.related_appointment_id = v_appointment.id
        and n.title = 'Payment failed'
    );

    v_expired_count := v_expired_count + 1;
  end loop;

  return v_expired_count;
end;
$function$;

revoke all on function public.expire_unpaid_appointments() from public, anon, authenticated;
grant execute on function public.expire_unpaid_appointments() to postgres, service_role;

create or replace function public.finalize_verified_paystack_payment(
  p_reference text,
  p_amount_kobo bigint,
  p_currency text,
  p_gateway_data jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_payment public.payments%rowtype;
  v_appointment public.appointments%rowtype;
  v_expected bigint;
  v_paid_at timestamptz;
  v_can_confirm boolean;
begin
  if coalesce(length(p_reference), 0) not between 1 and 200 then
    raise exception 'Invalid payment reference';
  end if;

  select * into v_payment
  from public.payments
  where reference = p_reference;

  if not found then
    return pg_catalog.jsonb_build_object('ok', false, 'reason', 'payment_not_found');
  end if;

  -- Keep the appointment/payment lock order aligned with the expiry job.
  select * into v_appointment
  from public.appointments
  where id = v_payment.appointment_id
  for update;

  if not found or v_appointment.patient_id <> v_payment.patient_id then
    return pg_catalog.jsonb_build_object('ok', false, 'reason', 'appointment_mismatch');
  end if;

  select * into v_payment
  from public.payments
  where id = v_payment.id
  for update;

  if not found or v_payment.appointment_id <> v_appointment.id then
    return pg_catalog.jsonb_build_object('ok', false, 'reason', 'payment_mismatch');
  end if;

  v_expected := pg_catalog.round(v_payment.amount * 100)::bigint;

  if upper(coalesce(p_currency, '')) <> 'NGN' or p_amount_kobo < v_expected then
    return pg_catalog.jsonb_build_object('ok', false, 'reason', 'amount_or_currency_mismatch');
  end if;

  if v_payment.status = 'success' and v_appointment.payment_status = 'paid' then
    return pg_catalog.jsonb_build_object(
      'ok', true, 'already_processed', true, 'appointment_id', v_appointment.id
    );
  end if;

  begin
    v_paid_at := nullif(p_gateway_data ->> 'paid_at', '')::timestamptz;
  exception when others then
    v_paid_at := null;
  end;
  v_paid_at := coalesce(v_paid_at, pg_catalog.now());

  v_can_confirm :=
    v_paid_at <= v_payment.created_at + interval '30 minutes'
    and (
      v_appointment.status <> 'cancelled'
      or v_appointment.payment_status = 'failed'
    );

  if not v_can_confirm then
    -- Keep a late Paystack charge visible in the ledger, but do not revive a
    -- cancelled/expired appointment. Notify the hospital for reconciliation.
    update public.payments
    set status = 'success',
        paystack_response = p_gateway_data,
        updated_at = pg_catalog.now()
    where id = v_payment.id;

    update public.appointments
    set status = 'cancelled',
        payment_status = 'failed',
        updated_at = pg_catalog.now()
    where id = v_appointment.id
      and payment_status <> 'paid';

    insert into public.notifications (
      user_id, title, body, type, related_appointment_id
    )
    select
      v_appointment.patient_id,
      'Late payment received',
      'Paystack confirmed a payment after the 30-minute window or after cancellation. The appointment remains cancelled. Please contact the hospital to review the payment.',
      'payment',
      v_appointment.id
    where not exists (
      select 1 from public.notifications n
      where n.user_id = v_appointment.patient_id
        and n.related_appointment_id = v_appointment.id
        and n.title = 'Late payment received'
    );

    insert into public.notifications (
      user_id, title, body, type, related_appointment_id
    )
    select
      d.id,
      'Late payment needs review',
      'Paystack confirmed a payment after the 30-minute window or after cancellation for appointment ' || v_appointment.id::text || '. Review the transaction and contact the patient about next steps.',
      'payment',
      v_appointment.id
    from public.profiles d
    where d.role = 'doctor'
      and not exists (
        select 1 from public.notifications n
        where n.user_id = d.id
          and n.related_appointment_id = v_appointment.id
          and n.title = 'Late payment needs review'
      );

    return pg_catalog.jsonb_build_object(
      'ok', false, 'reason', 'appointment_expired_or_cancelled',
      'appointment_id', v_appointment.id
    );
  end if;

  if v_appointment.payment_status = 'paid'
     and v_appointment.payment_reference is distinct from p_reference then
    update public.payments
    set status = 'failed',
        paystack_response = p_gateway_data,
        updated_at = pg_catalog.now()
    where id = v_payment.id;

    return pg_catalog.jsonb_build_object('ok', false, 'reason', 'appointment_already_paid');
  end if;

  update public.payments
  set status = 'success',
      paystack_response = p_gateway_data,
      updated_at = pg_catalog.now()
  where id = v_payment.id;

  update public.appointments
  set payment_status = 'paid',
      status = case when status in ('pending', 'cancelled') then 'confirmed' else status end,
      payment_reference = p_reference,
      updated_at = pg_catalog.now()
  where id = v_appointment.id;

  insert into public.notifications(user_id, title, body, type, related_appointment_id)
  select
    v_payment.patient_id,
    'Payment successful',
    'Your payment was verified. Your appointment status has been updated.',
    'payment',
    v_appointment.id
  where not exists (
    select 1 from public.notifications n
    where n.user_id = v_payment.patient_id
      and n.related_appointment_id = v_appointment.id
      and n.type = 'payment'
      and n.title = 'Payment successful'
  );

  return pg_catalog.jsonb_build_object(
    'ok', true, 'already_processed', false, 'appointment_id', v_appointment.id
  );
end;
$function$;

revoke all on function public.finalize_verified_paystack_payment(text, bigint, text, jsonb)
  from public, anon, authenticated;
grant execute on function public.finalize_verified_paystack_payment(text, bigint, text, jsonb)
  to service_role;

select cron.unschedule(jobid)
from cron.job
where jobname = 'omololu-expire-unpaid-appointments';

select cron.schedule(
  'omololu-expire-unpaid-appointments',
  '* * * * *',
  'select public.expire_unpaid_appointments();'
);
