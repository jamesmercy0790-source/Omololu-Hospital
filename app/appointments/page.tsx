"use client";
import { useEffect,useState } from "react";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabase";
type Service={id:string;name:string;description:string;price:number;duration_minutes:number};
type Appointment={id:string;appointment_date:string;appointment_time:string;status:string;payment_status:string;amount:number;reason_for_visit:string;service_id:string|null;payment_reference:string|null;created_at:string};
export default function AppointmentsPage(){
 const supabase=supabaseBrowser(),router=useRouter();
 const [userId,setUserId]=useState("");const [services,setServices]=useState<Service[]>([]);const [items,setItems]=useState<Appointment[]>([]);
 const [profile,setProfile]=useState<any>(null);const [serviceId,setServiceId]=useState("");const [date,setDate]=useState("");const [time,setTime]=useState("");const [slots,setSlots]=useState<string[]>([]);const [kind,setKind]=useState("first_visit");const [reason,setReason]=useState("");const [symptoms,setSymptoms]=useState("");const [notes,setNotes]=useState("");const [age,setAge]=useState("");const [gender,setGender]=useState("");const [busy,setBusy]=useState(false);const [error,setError]=useState("");const [message,setMessage]=useState("");
 async function load(){
  const {data:{user}}=await supabase.auth.getUser();if(!user){router.replace("/account?next=%2Fappointments");return;}
  setUserId(user.id);
  const [{data:sv,error:se},{data:pr},{data:ap,error:ae}]=await Promise.all([
   supabase.from("services").select("id,name,description,price,duration_minutes").eq("is_active",true).order("name"),
   supabase.from("profiles").select("id,email,full_name,phone,avatar_url,role").eq("id",user.id).maybeSingle(),
   supabase.from("appointments").select("id,appointment_date,appointment_time,status,payment_status,amount,reason_for_visit,service_id,payment_reference,created_at").eq("patient_id",user.id).order("created_at",{ascending:false})
  ]);
  if(se)setError("Could not load available services.");else{setServices((sv||[]) as Service[]);if(sv?.length&&!serviceId)setServiceId(sv[0].id);}
  setProfile(pr);if(ae)setError("Could not load appointments.");else setItems((ap||[]) as Appointment[]);
 }
 useEffect(()=>{void load();},[]);
 useEffect(()=>{let active=true;if(!date){setSlots([]);setTime("");return()=>{active=false};} (async()=>{const {data,error}=await supabase.rpc("get_available_slots",{p_date:date});if(!active)return;if(error){setSlots([]);setTime("");setError("Could not load appointment times for that date.");return;}const next=(data||[]).map((x:any)=>String(x.slot_time).slice(0,5));setSlots(next);setTime(next[0]||"");if(!next.length)setMessage("No appointment times are available on this date. Choose another date.");else setMessage("");})();return()=>{active=false};},[date]);
 async function book(e:React.FormEvent){
  e.preventDefault();setBusy(true);setError("");setMessage("");
  try{
   if(!serviceId)throw new Error("Choose a service.");
   if(reason.trim().length<2||reason.length>500)throw new Error("Reason must be 2–500 characters.");
   if(symptoms.length>3000||notes.length>3000)throw new Error("Symptoms and notes must each be 3,000 characters or fewer.");
   const {data,error}=await supabase.rpc("create_patient_appointment",{p_service_id:serviceId,p_date:date,p_time:time,p_appointment_type:kind,p_reason:reason.trim(),p_symptoms:symptoms,p_notes:notes,p_age:age===""?null:Number(age),p_gender:gender||null});
   if(error)throw error;
   const id=data as string;
   setMessage("Appointment request created. Continue to secure payment to confirm it.");
   const {data:payment,error:payError}=await supabase.functions.invoke("initialize-payment",{body:{appointment_id:id,platform:"web"}});
   if(payError||payment?.error)throw new Error(payment?.error||payError?.message||"Could not start payment. Your appointment remains unconfirmed.");
   if(payment?.status==="paid"){setMessage("This appointment is already paid.");await load();return;}
   if(!payment?.authorization_url)throw new Error("Payment link was not returned. Your appointment remains unconfirmed.");
   window.location.assign(payment.authorization_url);
  }catch(err){setError(err instanceof Error?err.message:"Could not create appointment.");await load();}
  finally{setBusy(false);}
 }
 async function pay(id:string){
  setBusy(true);setError("");setMessage("");
  try{const {data,error}=await supabase.functions.invoke("initialize-payment",{body:{appointment_id:id,platform:"web"}});if(error||data?.error)throw new Error(data?.error||error?.message||"Could not start payment.");if(data?.authorization_url)window.location.assign(data.authorization_url);else if(data?.status==="paid"){setMessage("Already paid.");await load();}else throw new Error("Payment session is not ready. Please wait and retry.");}
  catch(err){setError(err instanceof Error?err.message:"Could not start payment.");}finally{setBusy(false);}
 }
 const money=(v:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:2}).format(Number(v||0));
 return <><SiteHeader /><main className="booking-page"><div className="booking-wrap"><Link href="/" className="account-back">← Hospital home</Link>
 <p className="eyebrow">PATIENT PORTAL</p><h1>Appointments</h1><p className="account-intro">Your appointments and payment status are shared with the Omololu Hospital mobile app.</p>
 {error&&<p className="form-alert error" role="alert">{error}</p>}{message&&<p className="form-alert success" role="status">{message}</p>}
 {!profile?<div className="booking-panel"><p>Loading your secure account…</p><Link href="/account">Sign in</Link></div>:<>
 <section className="booking-panel"><h2>Book an appointment</h2><p>Signed in as {profile.full_name||profile.email}. Fees are retrieved from the hospital database and cannot be changed in this form.</p>
 <form className="account-form booking-form" onSubmit={book}>
 <label>Service<select value={serviceId} onChange={e=>setServiceId(e.target.value)} required><option value="">Choose a service</option>{services.map(s=><option key={s.id} value={s.id}>{s.name} — {money(s.price)}</option>)}</select></label>
 <div className="form-grid"><label>Date<input type="date" value={date} min={new Date().toLocaleDateString("en-CA")} max={new Date(Date.now()+180*86400000).toLocaleDateString("en-CA")} onChange={e=>setDate(e.target.value)} required/></label><label>Available time<select value={time} onChange={e=>setTime(e.target.value)} required disabled={!date||!slots.length}><option value="">{!date?"Choose a date first":slots.length?"Choose a time":"No available times"}</option>{slots.map(slot=><option key={slot} value={slot}>{slot}</option>)}</select></label></div>
 <label>Visit type<select value={kind} onChange={e=>setKind(e.target.value)}><option value="first_visit">First visit</option><option value="follow_up">Follow-up</option></select></label>
 <label>Reason for visit<textarea value={reason} onChange={e=>setReason(e.target.value)} maxLength={500} rows={3} required placeholder="Brief reason for your visit"/></label>
 <label>Symptoms (optional)<textarea value={symptoms} onChange={e=>setSymptoms(e.target.value)} maxLength={3000} rows={3} placeholder="Describe symptoms, if relevant"/></label>
 <label>Additional notes (optional)<textarea value={notes} onChange={e=>setNotes(e.target.value)} maxLength={3000} rows={3} placeholder="Other information for the hospital"/></label>
 <div className="form-grid"><label>Age (optional)<input type="number" min="0" max="120" value={age} onChange={e=>setAge(e.target.value)}/></label><label>Gender (optional)<select value={gender} onChange={e=>setGender(e.target.value)}><option value="">Prefer not to say</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option><option value="prefer_not_to_say">Prefer not to say</option></select></label></div>
 <button className="button primary full" disabled={busy||!services.length||!slots.length||!time}>{busy?"Processing securely…":"Request appointment and pay"}</button>
 <small>Appointment confirmation happens only after server-side Paystack verification. Refreshing this page will not mark a payment as successful.</small>
 </form></section>
 <section className="booking-panel"><h2>Your appointments</h2>{!items.length?<p>No appointments yet.</p>:<div className="appointment-list">{items.map(a=><article className="appointment-item" key={a.id}><div><strong>{services.find(s=>s.id===a.service_id)?.name||"Hospital appointment"}</strong><p>{a.appointment_date} at {String(a.appointment_time).slice(0,5)}</p><p>{a.reason_for_visit}</p><div className="status-row"><span className={"status-pill "+(a.payment_status==="paid"?"paid":"pending")}>Payment: {a.payment_status}</span><span className="status-pill">Status: {a.status}</span></div></div><div className="appointment-side"><strong>{money(a.amount)}</strong>{a.payment_status!=="paid"&&a.status!=="cancelled"&&a.status!=="completed"&&<button className="button primary" disabled={busy} onClick={()=>void pay(a.id)}>Pay securely</button>}</div></article>)}</div>}</section>
 </>}
 <p className="privacy-note">For emergencies, call +234 806 748 9645 or +234 803 377 0933. Do not wait for an online appointment.</p></div></main></>;
}
