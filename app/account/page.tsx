"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import { supabaseBrowser } from "../../lib/supabase";

type Profile = { id:string; email:string; full_name:string; phone:string; avatar_url:string|null; role:string };
type TurnstileApi = { render:(container:HTMLElement, options:{sitekey:string;callback:(token:string)=>void;"expired-callback"?:()=>void;"error-callback"?:()=>void})=>string; reset:(widgetId?:string)=>void };
declare global { interface Window { turnstile?: TurnstileApi } }
export default function AccountPage() {
  const supabase = supabaseBrowser();
  const [mode,setMode] = useState<"login"|"signup">("login");
  const [recoveryMode,setRecoveryMode] = useState(false);
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [profile,setProfile] = useState<Profile|null>(null);
  const [avatar,setAvatar] = useState("");
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  const [error,setError] = useState("");
  const [captchaToken,setCaptchaToken] = useState("");
  const captchaRef = useRef<HTMLDivElement>(null);
  const captchaWidgetId = useRef<string | null>(null);
  const captchaSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  async function loadProfile() {
    const {data:{user}} = await supabase.auth.getUser();
    if(!user) { setProfile(null); return; }
    const {data} = await supabase.from("profiles").select("id,email,full_name,phone,avatar_url,role").eq("id",user.id).maybeSingle();
    if(data?.role==="doctor") { setProfile(null); await supabase.auth.signOut(); setError("Doctor accounts can only be accessed through the OMOLOLU HOSPITAL Android app."); return; }
    if(data) { setProfile(data as Profile); setName(data.full_name||""); setPhone(data.phone||""); setAvatar(data.avatar_url||""); }
  }
  useEffect(()=>{ void loadProfile(); const {data:{subscription}}=supabase.auth.onAuthStateChange((event)=>{ if(event==="PASSWORD_RECOVERY") { setRecoveryMode(true); setProfile(null); setMessage("Choose a new password for your account."); } else if(event==="SIGNED_OUT") { setRecoveryMode(false); } else { void loadProfile(); } }); return ()=>subscription.unsubscribe(); },[]);
  function renderCaptcha() {
    if (!captchaSiteKey || !captchaRef.current || !window.turnstile || captchaWidgetId.current) return;
    captchaWidgetId.current = window.turnstile.render(captchaRef.current, {
      sitekey: captchaSiteKey,
      callback: (token) => { setCaptchaToken(token); setError(""); },
      "expired-callback": () => setCaptchaToken(""),
      "error-callback": () => { setCaptchaToken(""); setError("Security check failed. Please try again."); },
    });
  }
  function resetCaptcha() {
    setCaptchaToken("");
    if (captchaWidgetId.current && window.turnstile) window.turnstile.reset(captchaWidgetId.current);
  }
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    if (captchaSiteKey && !captchaToken) { setBusy(false); setError("Complete the security check first."); return; }
    try {
      if(!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error("Enter a valid email address.");
      if(password.length<8) throw new Error("Password must be at least 8 characters.");
      if(mode==="signup") {
        if(name.trim().length<2 || name.length>120) throw new Error("Enter your full name (2–120 characters).");
        if(phone.trim().length<7 || phone.length>30) throw new Error("Enter a valid phone number.");
        const {data,error}=await supabase.auth.signUp({email:email.trim().toLowerCase(),password,options:{data:{full_name:name.trim(),phone:phone.trim(),role:"patient"},captchaToken:captchaSiteKey?captchaToken:undefined}});
        if(error) throw error;
        if(!data.session) setMessage("Account created. Check your email to confirm the account, then sign in.");
        else { setMessage("Account created."); await loadProfile(); }
      } else {
        const {data,error}=await supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password,options:{captchaToken:captchaSiteKey?captchaToken:undefined}});
        if(error) throw error;
        const {data:accountProfile,error:profileError}=await supabase.from("profiles").select("role").eq("id",data.user.id).maybeSingle();
        if(profileError) throw profileError;
        if(accountProfile?.role==="doctor") { await supabase.auth.signOut(); throw new Error("Doctor accounts can only be accessed through the OMOLOLU HOSPITAL Android app."); }
        setMessage("Signed in successfully."); await loadProfile();
      }
    } catch(err) { setError(err instanceof Error?err.message:"Unable to complete the request."); }
    finally {setBusy(false); if(captchaSiteKey) resetCaptcha();}
  }
  async function updatePassword(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      if(newPassword.length<8) throw new Error("Your new password must be at least 8 characters.");
      if(newPassword!==confirmPassword) throw new Error("The passwords do not match.");
      const {error}=await supabase.auth.updateUser({password:newPassword});
      if(error) throw error;
      setRecoveryMode(false); setNewPassword(""); setConfirmPassword("");
      setMessage("Password updated successfully. You can now sign in with your new password.");
      await supabase.auth.signOut();
    } catch(err) { setError(err instanceof Error?err.message:"Unable to update password. Request a new reset link and try again."); }
    finally { setBusy(false); }
  }
  async function saveProfile(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const {data:{user}}=await supabase.auth.getUser(); if(!user) throw new Error("Please sign in again.");
      if(name.trim().length<2||name.length>120) throw new Error("Name must be 2–120 characters.");
      if(phone.trim().length<7||phone.length>30) throw new Error("Enter a valid phone number.");
      const {error}=await supabase.from("profiles").update({full_name:name.trim(),phone:phone.trim(),avatar_url:avatar||null,updated_at:new Date().toISOString()}).eq("id",user.id);
      if(error) throw error;
      setMessage("Profile saved. Your app and website use the same profile.");
      await loadProfile();
    } catch(err) {setError(err instanceof Error?err.message:"Unable to save profile.");}
    finally {setBusy(false);}
  }
  async function uploadAvatar(file?:File) {
    if(!file)return;
    setError("");setMessage("");
    try {
      const {data:{user}}=await supabase.auth.getUser();if(!user)throw new Error("Sign in first.");
      if(file.size>3*1024*1024)throw new Error("Image must be 3 MB or smaller.");
      if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw new Error("Use a JPG, PNG or WebP image.");
      const path=user.id+"/"+crypto.randomUUID()+"."+({ "image/jpeg":"jpg","image/png":"png","image/webp":"webp"} as Record<string,string>)[file.type];
      const {error}=await supabase.storage.from("avatars").upload(path,file,{contentType:file.type,upsert:false});
      if(error)throw error;
      const {data}=supabase.storage.from("avatars").getPublicUrl(path);
      setAvatar(data.publicUrl);
      const {error:saveError}=await supabase.from("profiles").update({avatar_url:data.publicUrl,updated_at:new Date().toISOString()}).eq("id",user.id);
      if(saveError)throw saveError;
      setMessage("Profile picture updated for the website and app.");await loadProfile();
    }catch(err){setError(err instanceof Error?err.message:"Could not upload picture.");}
  }
  async function signOut(){await supabase.auth.signOut();setProfile(null);setMessage("Signed out.");}
  return <><SiteHeader /><main className="account-page"><div className="account-card">
    <Link href="/" className="account-back">← Hospital home</Link>
    <p className="eyebrow">PATIENT ACCOUNT</p><h1>{profile?"Your profile":"Welcome to Omololu Hospital"}</h1>
    <p className="account-intro">Use the same hospital account as the mobile app.</p>
    {error&&<p className="form-alert error" role="alert">{error}</p>}{message&&<p className="form-alert success" role="status">{message}</p>}
    {recoveryMode ? <form onSubmit={updatePassword} className="account-form"><label>New password<input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} minLength={8} maxLength={128} autoComplete="new-password" required /></label><label>Confirm new password<input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} minLength={8} maxLength={128} autoComplete="new-password" required /></label><button className="button primary full" disabled={busy}>{busy?"Updating…":"Update password"}</button></form> : profile ? <form onSubmit={saveProfile} className="account-form">
      <div className="avatar-row">{avatar?<img src={avatar} alt="Your profile" className="patient-avatar"/>:<div className="patient-avatar placeholder">{(name||profile.email).slice(0,1).toUpperCase()}</div>}
        <label className="button secondary">Change picture<input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={e=>void uploadAvatar(e.target.files?.[0])}/></label></div>
      <label>Full name<input value={name} maxLength={120} onChange={e=>setName(e.target.value)} required /></label>
      <label>Email<input value={profile.email} readOnly /></label>
      <label>Phone number<input value={phone} maxLength={30} onChange={e=>setPhone(e.target.value)} required /></label>
      <button className="button primary full" disabled={busy}>{busy?"Saving…":"Save profile"}</button>
      <Link className="button secondary full" href="/appointments">Book or view appointments</Link>
      <button type="button" className="text-button" onClick={()=>void signOut()}>Sign out</button>
    </form> : <form onSubmit={submit} className="account-form">
      {mode==="signup"&&<><label>Full name<input value={name} maxLength={120} onChange={e=>setName(e.target.value)} required autoComplete="name"/></label><label>Phone number<input value={phone} maxLength={30} onChange={e=>setPhone(e.target.value)} required autoComplete="tel"/></label></>}
      <label>Email address<input type="email" value={email} maxLength={254} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/></label>
      <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} maxLength={128} required autoComplete={mode==="signup"?"new-password":"current-password"}/></label>
      <button className="button primary full" disabled={busy}>{busy?"Please wait…":mode==="signup"?"Create patient account":"Sign in"}</button>
      <button type="button" className="text-button" onClick={()=>{setMode(mode==="login"?"signup":"login");setError("");setMessage("");if(captchaSiteKey)resetCaptcha();}}>{mode==="login"?"New patient? Create an account":"Already have an account? Sign in"}</button>
      <button type="button" className="text-button" onClick={async()=>{setError("");setMessage("");if(!email.trim()){setError("Enter your email first.");return;}if(captchaSiteKey&&!captchaToken){setError("Complete the security check first.");return;}const {error}=await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(),{redirectTo:window.location.origin+"/account",captchaToken:captchaSiteKey?captchaToken:undefined});if(captchaSiteKey)resetCaptcha();if(error)setError(error.message);else setMessage("If the email is registered, a password-reset link has been sent.");}}>Forgot password?</button>
    </form>}
    <p className="privacy-note">Do not use online booking for emergencies. Call the hospital directly.</p>
  </div></main></>;
}
