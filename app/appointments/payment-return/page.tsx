"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {supabaseBrowser} from "../../../lib/supabase";
export default function PaymentReturnPage(){
 const [state,setState]=useState("Checking your payment securely…");const [ok,setOk]=useState(false);
 useEffect(()=>{let active=true;(async()=>{
  const params=new URLSearchParams(window.location.search),reference=params.get("reference")||params.get("trxref");
  if(!reference){if(active)setState("No payment reference was provided. Check your appointment status below.");return;}
  const supabase=supabaseBrowser();const {data:{user}}=await supabase.auth.getUser();
  if(!user){if(active)setState("Payment return received. Sign in with your hospital account to verify and view your appointment.");return;}
  const {data,error}=await supabase.functions.invoke("verify-payment",{body:{reference}});
  if(!active)return;
  if(error){setState("We could not confirm the payment yet. Your appointment will remain unconfirmed until Paystack verification succeeds.");return;}
  if(data?.status==="success"){setOk(true);setState("Payment verified successfully. Your appointment status has been updated.");}
  else if(data?.status==="pending")setState("Paystack is still processing this payment. Do not pay again. Check your appointments shortly.");
  else setState(data?.error||"Payment has not been confirmed. Do not pay again if your bank has already debited you; contact the hospital.");
 })();return()=>{active=false};},[]);
 return <main className="account-page"><section className="account-card"><p className="eyebrow">SECURE PAYMENT STATUS</p><h1>{ok?"Payment successful":"Payment status"}</h1><p className="account-intro" role="status">{state}</p><div className="account-form"><Link className="button primary full" href="/appointments">View appointments</Link><Link className="button secondary full" href="/">Hospital home</Link></div><p className="privacy-note">Never share your password or payment details with anyone claiming to be hospital staff.</p></section></main>;
}
