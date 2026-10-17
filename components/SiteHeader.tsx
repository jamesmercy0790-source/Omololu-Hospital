"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["FAQs", "/faq"],
  ["Hospital App", "/hospital-app"],
  ["Contact", "/contact"],
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

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
          <a className="emergency-button" href="tel:+2348067489645" aria-label="Call the hospital emergency hotline">
            Call Emergency
          </a>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" href="/" aria-label="Omololu Hospital home">
            <img src="/photo_2026-09-26_02-25-49.jpg" alt="Omololu Hospital logo" />
            <span>OMOLOLU HOSPITAL</span>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" className={menuOpen ? "menu-icon is-open" : "menu-icon"}><i /><i /><i /></span>
            <span className="menu-label">{menuOpen ? "Close" : "Menu"}</span>
          </button>
          <nav id="primary-navigation" className={menuOpen ? "primary-navigation is-open" : "primary-navigation"} aria-label="Main navigation">
            {links.map(([label, href]) => (
              <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={pathname === href ? "nav-link active" : "nav-link"}>
                {label}
              </Link>
            ))}
            <Link className="button primary nav-download" href="/downloads/omololu-hospital.apk" download>Download App</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
