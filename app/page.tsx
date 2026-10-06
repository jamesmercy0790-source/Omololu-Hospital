import ScrollReveal from "../components/ScrollReveal";

export default function Home() {
  const services = [
    { title: "Medical Consultation", text: "Professional consultations with the hospital doctor." },
    { title: "Medical Care", text: "Accessible clinical care focused on patients and their needs." },
    { title: "Laboratory Services", text: "Diagnostic laboratory services supporting clinical care." },
  ];

  return (
    <main>
      <header className="site-header">
        <div className="container nav">
          <a className="brand" href="#">
            <img src="/photo_2026-09-26_02-25-49.jpg" alt="Omololu Hospital logo" />
            <span>OMOLOLU HOSPITAL</span>
          </a>
          <a className="mobile-download" href="/downloads/omololu-hospital.apk" download>
            Download App
          </a>
          <nav aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#doctor">Doctor</a>
            <a href="#app">Hospital App</a>
            <a href="#contact">Contact</a>
            <a className="button primary" href="/downloads/omololu-hospital.apk" download>
              Download App
            </a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">Quality healthcare, made simple.</p>
            <h1>Welcome to <span>OMOLOLU HOSPITAL</span></h1>
            <p className="hero-copy">
              OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES provides accessible healthcare
              and diagnostic support with patient-focused service.
            </p>
            <div className="actions">
              <a className="button primary" href="tel:+2348067489645">Call the Hospital</a>
              <a className="button secondary" href="#services">View Services</a>
            </div>
            <div className="quick-contact">
              <span>📞 +234 806 748 9645</span>
              <span>📞 +234 803 377 0933</span>
            </div>
          </div>
          <div className="hero-card">
            <img src="/photo_2026-09-26_02-25-49.jpg" alt="OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES" />
            <p>Patient-focused care and convenient access to hospital services.</p>
          </div>
        </div>
      </section>

      <ScrollReveal>
        <section id="about" className="section">
          <div className="container two-col">
            <div>
              <p className="eyebrow">About the hospital</p>
              <h2>Healthcare with people at the centre.</h2>
            </div>
            <div>
              <p className="section-copy">
                OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES is a healthcare facility
                serving patients from its location in Ibadan, Oyo State, Nigeria.
                The hospital combines medical care, consultation and diagnostic services
                with a simple digital experience for patients.
              </p>
              <p className="section-copy">
                <strong>Address:</strong> The Beacon Plaza, Opp IELTS Branch office,
                Akobo, Ojuirin, Ibadan, Oyo State, Nigeria.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <section id="services" className="section muted">
        <div className="container">
          <ScrollReveal>
            <p className="eyebrow">Medical services</p>
            <h2>Care and diagnostic services</h2>
          </ScrollReveal>
          <div className="cards">
            {services.map((service, index) => (
              <ScrollReveal key={service.title} delay={index * 90}>
                <article className="card">
                  <div className="card-icon">+</div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ScrollReveal>
        <section id="doctor" className="section">
          <div className="container doctor-panel">
            <div className="doctor-avatar">DR</div>
            <div>
              <p className="eyebrow">Medical team</p>
              <h2>Dr. (Mrs.) Omololu-Aso Oluwaseun Oluwatoyin</h2>
              <p className="doctor-role">CMD / CEO</p>
              <p className="section-copy">
                The hospital is led by Dr. (Mrs.) Omololu-Aso Oluwaseun Oluwatoyin,
                with the professional profile maintained for the hospital's digital services.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <section id="app" className="section app-section">
        <div className="container">
          <ScrollReveal>
            <div className="app-copy">
              <p className="eyebrow">Hospital app</p>
              <h2>Appointments made simpler.</h2>
              <p className="section-copy">
                The OMOLOLU HOSPITAL mobile application gives patients a dedicated
                account for managing their hospital experience.
              </p>
              <p className="section-copy">
                Android users can download the app and follow the installation prompt on their phone.
              </p>
            </div>
          </ScrollReveal>
          <div className="feature-grid">
            <ScrollReveal delay={0}>
              <article className="feature"><strong>Patient accounts</strong><span>Create an account and keep your session active until you log out or remove the app.</span></article>
            </ScrollReveal>
            <ScrollReveal delay={90}>
              <article className="feature"><strong>Appointment booking</strong><span>Request first-visit or follow-up appointments and track their status.</span></article>
            </ScrollReveal>
            <ScrollReveal delay={180}>
              <article className="feature"><strong>Secure payment</strong><span>Appointment payments are handled before an appointment is confirmed.</span></article>
            </ScrollReveal>
            <ScrollReveal delay={270}>
              <article className="feature"><strong>Notifications</strong><span>Patients receive updates about account and appointment activity.</span></article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <ScrollReveal>
        <section id="contact" className="section contact">
          <div className="container contact-grid">
            <div>
              <p className="eyebrow">Contact</p>
              <h2>Get in touch with OMOLOLU HOSPITAL</h2>
              <p className="section-copy">
                For enquiries, appointments and hospital information, contact the hospital directly.
              </p>
            </div>
            <div className="contact-card">
              <p><strong>Address</strong><br />The Beacon Plaza, Opp IELTS Branch office, Akobo, Ojuirin, Ibadan, Oyo State, Nigeria.</p>
              <p><strong>Phone</strong><br /><a href="tel:+2348067489645">+234 806 748 9645</a><br /><a href="tel:+2348033770933">+234 803 377 0933</a></p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <footer>
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES</span>
          <span>Quality healthcare, made simple.</span>
          <a className="button primary" href="/downloads/omololu-hospital.apk" download>
            Download OMOLOLU HOSPITAL App
          </a>
        </div>
      </footer>

      <a
        className="whatsapp-float"
        href="https://wa.me/2348067489645?text=Hello%20Dr.%20Omololu%2C%20I%20would%20like%20to%20make%20an%20enquiry."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with the doctor on WhatsApp"
        title="Chat with the doctor on WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.52 3.48A11.82 11.82 0 0 0 12.05 0C5.5 0 .17 5.32.17 11.88c0 2.09.55 4.13 1.6 5.93L.07 24l6.34-1.66a11.86 11.86 0 0 0 5.64 1.43h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.15-3.42-8.41ZM12.06 21.7h-.01a9.83 9.83 0 0 1-5.01-1.37l-.36-.21-3.76.98 1-3.67-.23-.38a9.84 9.84 0 0 1-1.51-5.18C2.18 6.43 6.61 2 12.06 2a9.82 9.82 0 0 1 6.98 2.89 9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.43 9.82-9.88 9.82Zm5.4-7.37c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </a>
    </main>
  );
}
