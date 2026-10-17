"use client";

import Link from "next/link";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["FAQs", "/faq"],
  ["Hospital App", "/hospital-app"],
  ["Contact", "/contact"],
];

export default function SiteHeader() {
  return (
    <>
      <div className="emergency-bar">
        <div className="container emergency-inner">
          <div className="emergency-copy">
            <strong>24-HOUR EMERGENCY HOTLINE</strong>
            <a href="tel:+2348067489645">+234 806 748 9645</a>
            <span className="emergency-separator">|</span>
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
          <nav aria-label="Main navigation">
            {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            <Link className="button primary nav-download" href="/downloads/omololu-hospital.apk" download>Download App</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
