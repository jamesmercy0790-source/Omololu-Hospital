"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabaseBrowser } from "../lib/supabase";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["FAQs", "/faq"],
  ["Hospital App", "/hospital-app"],
  ["Contact", "/contact"],
];

const ACTIVITY_KEY = "omololu_web_last_activity";
const SESSION_LIMIT_MS = 30 * 60 * 1000;

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const supabase = supabaseBrowser();
    let active = true;
    let checkTimer: ReturnType<typeof setInterval> | undefined;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    const touchActivity = () => {
      if (localStorage.getItem(ACTIVITY_KEY) && Date.now() - Number(localStorage.getItem(ACTIVITY_KEY)) < SESSION_LIMIT_MS) {
        localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
      }
    };
    const expireIfIdle = async () => {
      const last = Number(localStorage.getItem(ACTIVITY_KEY) || 0);
      if (last && Date.now() - last >= SESSION_LIMIT_MS) {
        localStorage.removeItem(ACTIVITY_KEY);
        await supabase.auth.signOut();
        if (active) setSignedIn(false);
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === ACTIVITY_KEY) void expireIfIdle();
    };
    const start = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      setSignedIn(Boolean(session));
      if (session) {
        const last = Number(localStorage.getItem(ACTIVITY_KEY) || 0);
        if (last && Date.now() - last >= SESSION_LIMIT_MS) {
          localStorage.removeItem(ACTIVITY_KEY);
          await supabase.auth.signOut();
          if (active) setSignedIn(false);
        } else if (!last) {
          localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
        }
      } else {
        localStorage.removeItem(ACTIVITY_KEY);
      }
      checkTimer = setInterval(() => { void expireIfIdle(); }, 5000);
    };
    void start();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "INITIAL_SESSION" && session) {
        const last = Number(localStorage.getItem(ACTIVITY_KEY) || 0);
        if (last && Date.now() - last >= SESSION_LIMIT_MS) {
          localStorage.removeItem(ACTIVITY_KEY);
          setSignedIn(false);
          void supabase.auth.signOut();
          return;
        }
        if (!last) localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
      }
      setSignedIn(Boolean(session));
      if (event === "SIGNED_IN") localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
      if (event === "SIGNED_OUT") localStorage.removeItem(ACTIVITY_KEY);
    });
    const activityEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll", "touchstart", "mousemove"];
    activityEvents.forEach((event) => window.addEventListener(event, touchActivity, { passive: true }));
    window.addEventListener("focus", touchActivity);
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("storage", onStorage);
    return () => {
      active = false;
      subscription.unsubscribe();
      if (checkTimer) clearInterval(checkTimer);
      activityEvents.forEach((event) => window.removeEventListener(event, touchActivity));
      window.removeEventListener("focus", touchActivity);
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  async function signOut() {
    await supabaseBrowser().auth.signOut();
    setSignedIn(false);
    setMenuOpen(false);
  }

  return (
    <>
      <div className="emergency-bar">
        <div className="container emergency-inner">
          <div className="emergency-copy">
            <strong>24-HOUR EMERGENCY HOTLINE</strong>
            <a href="tel:+2348067489645">+234 806 748 9645</a>
            <span className="emergency-separator" aria-hidden="true">|</span>
            <a href="tel:+2348033770933">+234 803 377 0933</a>
          </div>
          <div className="emergency-actions"><Link className="emergency-book-button" href="/appointments">Book Appointment</Link><a className="emergency-button" href="tel:+2348067489645" aria-label="Call the hospital emergency hotline">Call Emergency</a></div>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" href="/" aria-label="Omololu Hospital home">
            <img src="/photo_2026-09-26_02-25-49.jpg" alt="Omololu Hospital logo" />
            <span>OMOLOLU HOSPITAL</span>
          </Link>
          <div className="mobile-nav-actions">
            <Link className="button primary mobile-book" href="/appointments">Book Appointment</Link>
            <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
              <span aria-hidden="true" className={menuOpen ? "menu-icon is-open" : "menu-icon"}><i /><i /><i /></span>
              <span className="menu-label">{menuOpen ? "Close" : "Menu"}</span>
            </button>
          </div>
          <nav id="primary-navigation" className={menuOpen ? "primary-navigation is-open" : "primary-navigation"} aria-label="Main navigation">
            {links.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={pathname === href ? "nav-link active" : "nav-link"}>{label}</Link>)}
            <Link className="nav-link" href="/appointments" aria-current={pathname === "/appointments" ? "page" : undefined}>Appointments</Link>
            {signedIn && <Link className="nav-link" href="/account">My Profile</Link>}
            {!signedIn && <Link className="button primary nav-download" href="/account">Patient Login</Link>}
            {signedIn && <button className="nav-signout" type="button" onClick={() => void signOut()}>Sign out</button>}
            <Link className="button primary nav-download" href="/downloads/omololu-hospital.apk" download>Download App</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
