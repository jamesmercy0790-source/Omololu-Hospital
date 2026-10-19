import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "../components/ScrollReveal";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "24-Hour Hospital in Akobo, Ibadan",
  description: "Omololu Hospital and Diagnostic Services provides 24-hour healthcare, emergency services, maternity care, surgery, laboratory tests and ultrasound services in Akobo, Ibadan.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES", title: "24-Hour Hospital in Akobo, Ibadan | Omololu Hospital", description: "Omololu Hospital and Diagnostic Services provides 24-hour healthcare, emergency services, maternity care, surgery, laboratory tests and ultrasound services in Akobo, Ibadan.", images: [{ url: "/photo_2026-09-26_02-25-49.jpg", alt: "OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES" }] },
  twitter: { card: "summary_large_image", title: "24-Hour Hospital in Akobo, Ibadan | Omololu Hospital", description: "Omololu Hospital and Diagnostic Services provides 24-hour healthcare, emergency services, maternity care, surgery, laboratory tests and ultrasound services in Akobo, Ibadan.", images: ["/photo_2026-09-26_02-25-49.jpg"] },
};

const services = [
  "General medical consultations and treatment", "24-hour emergency medical care",
  "Obstetrics and maternity services", "Gynaecological care",
  "General and selected specialist surgical services", "Paediatric and newborn care",
  "Laboratory investigations", "Ultrasound and diagnostic services",
  "Family planning and reproductive healthcare", "Preventive healthcare and medical screening",
  "Inpatient admission and nursing care",
];

export default function Home() {
  return <main>
    <SiteHeader />
    <section className="hero"><div className="container hero-grid">
      <div className="hero-content">
        <p className="eyebrow">OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES</p>
        <h1>Your Health Is <span>Our Priority</span></h1>
        <p className="hero-copy">We are dedicated to providing comprehensive, compassionate, and high-quality healthcare to individuals and families. We are open 24 hours a day, seven days a week, including public holidays.</p>
        <div className="actions"><a className="button primary" href="tel:+2348067489645">Call Emergency</a><Link className="button secondary" href="/services">Explore Our Services</Link></div>
        <div className="quick-contact"><a href="tel:+2348067489645">+234 806 748 9645</a><a href="tel:+2348033770933">+234 803 377 0933</a></div>
        <p className="hero-service-line">Comprehensive Medical Care | Specialist Services | Diagnostic Excellence | 24-Hour Emergency Care</p>
      </div>
      <div className="hero-card"><img src="/photo_2026-09-26_02-25-49.jpg" alt="Omololu Hospital and Diagnostic Services logo" /><h2 className="hero-card-title">Quality Healthcare for You.</h2><p>Professional medical attention, accurate diagnosis, effective treatment, and personalised care in a safe and welcoming environment.</p><a className="button primary full-button" href="tel:+2348067489645">Call the Hospital</a></div>
    </div></section>
    <ScrollReveal><section className="section"><div className="container two-col">
      <div><p className="eyebrow">Welcome to Omololu Hospital</p><h2>Where medical excellence meets compassionate care.</h2></div>
      <div><p className="section-copy">We believe that every patient deserves professional medical attention, accurate diagnosis, effective treatment, and personalised care in a safe and welcoming environment.</p><p className="section-copy">Our services encompass preventive healthcare, medical consultations, emergency care, specialist assessment, surgical services, maternal and child healthcare, and diagnostic investigations.</p><p className="section-copy">Our commitment is to deliver healthcare with professionalism, integrity, compassion, and respect for human dignity.</p><Link className="text-link" href="/about">Learn about our hospital →</Link></div>
    </div></section></ScrollReveal>
    <section className="section muted"><div className="container"><ScrollReveal><p className="eyebrow">Our services</p><h2>Comprehensive care for you and your family</h2></ScrollReveal>
      <div className="service-list-grid">{services.slice(0,6).map((service,index)=><ScrollReveal key={service} delay={index*60}><article className="card service-list-card"><span className="service-check" aria-hidden="true">+</span><h3>{service}</h3></article></ScrollReveal>)}</div>
      <div className="center-actions"><Link className="button primary" href="/services">View All Services</Link></div>
    </div></section>
    <ScrollReveal><section className="section vision-section"><div className="container two-col"><div><p className="eyebrow">Our vision</p><h2>Improving health and well-being in our community.</h2></div><div><p className="section-copy">To be a leading healthcare institution recognised for excellence in medical practice, reliable diagnostic services, compassionate patient care, and an enduring commitment to improving the health and well-being of our community.</p><Link className="text-link" href="/about">Read our mission and core values →</Link></div></div></section></ScrollReveal>
    <section className="section app-section"><div className="container two-col app-home-grid"><div><p className="eyebrow">Hospital app</p><h2>Manage your hospital experience digitally.</h2><p className="section-copy">Download the OMOLOLU HOSPITAL Android application for patient accounts and appointment requests.</p></div><div className="app-home-card"><h3>OMOLOLU HOSPITAL App</h3><p>Access account and appointment features from your Android phone.</p><div className="actions"><Link className="button primary" href="/appointments">Book Appointment Online</Link><a className="button primary" href="/downloads/omololu-hospital.apk" download>Download Android App</a></div><p className="small-note">For general enquiries or emergencies, please call the hospital directly.</p></div></div></section>
    <section className="section contact"><div className="container contact-grid"><div><p className="eyebrow">Visit or contact us</p><h2>We are here for you, day and night.</h2><p className="section-copy">Open 24 hours daily, including weekends and public holidays.</p><div className="actions"><Link className="button secondary light-button" href="/contact">Contact and Directions</Link><Link className="button primary" href="/faq">Frequently Asked Questions</Link></div></div><div className="contact-card"><p><strong>Address</strong><br />The Beacon Plaza, Opposite Grandmart Store, Akobo, Ojuirin, Ibadan, Oyo State, Nigeria.</p><p><strong>Emergency hotline</strong><br /><a href="tel:+2348067489645">+234 806 748 9645</a><br /><a href="tel:+2348033770933">+234 803 377 0933</a></p></div></div></section>
    <SiteFooter />
    <a className="whatsapp-float" href="https://wa.me/2348067489645?text=Hello%20Omololu%20Hospital%2C%20I%20would%20like%20to%20make%20an%20enquiry." target="_blank" rel="noopener noreferrer" aria-label="Contact Omololu Hospital on WhatsApp" title="Contact Omololu Hospital on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.82 11.82 0 0 0 12.05 0C5.5 0 .17 5.32.17 11.88c0 2.09.55 4.13 1.6 5.93L.07 24l6.34-1.66a11.86 11.86 0 0 0 5.64 1.43h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.15-3.42-8.41ZM12.06 21.7h-.01a9.83 9.83 0 0 1-5.01-1.37l-.36-.21-3.76.98 1-3.67-.23-.38a9.84 9.84 0 0 1-1.51-5.18C2.18 6.43 6.61 2 12.06 2a9.82 9.82 0 0 1 6.98 2.89 9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.43 9.82-9.88 9.82Zm5.4-7.37c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35Z"/></svg></a>
  </main>;
}
