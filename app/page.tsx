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
            <img src="/omololu_hospital_logo.svg" alt="Omololu Hospital logo" />
            <span>OMOLOLU HOSPITAL</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#doctor">Doctor</a>
            <a href="#app">Hospital App</a>
            <a href="#contact">Contact</a>
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
            <img src="/omololu_hospital_logo.svg" alt="OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES" />
            <p>Patient-focused care and convenient access to hospital services.</p>
          </div>
        </div>
      </section>

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

      <section id="services" className="section muted">
        <div className="container">
          <p className="eyebrow">Medical services</p>
          <h2>Care and diagnostic services</h2>
          <div className="cards">
            {services.map((service) => (
              <article className="card" key={service.title}>
                <div className="card-icon">+</div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="doctor" className="section">
        <div className="container doctor-panel">
          <div className="doctor-avatar">DR</div>
          <div>
            <p className="eyebrow">Medical team</p>
            <h2>Dr. (Mrs.) Omololu-Aso Oluwaseun Oluwatoyin</h2>
            <p className="doctor-role">CMD / O&amp;G</p>
            <p className="section-copy">
              The hospital is led by Dr. (Mrs.) Omololu-Aso Oluwaseun Oluwatoyin,
              with the professional profile maintained for the hospital's digital services.
            </p>
          </div>
        </div>
      </section>

      <section id="app" className="section app-section">
        <div className="container">
          <div className="app-copy">
            <p className="eyebrow">Hospital app</p>
            <h2>Appointments made simpler.</h2>
            <p className="section-copy">
              The OMOLOLU HOSPITAL mobile application gives patients a dedicated
              account for managing their hospital experience.
            </p>
            <div className="actions">
              <a className="button primary" href="/downloads/omololu-hospital.apk" download>
                Download OMOLOLU HOSPITAL App
              </a>
            </div>
            <p className="section-copy">
              Android users can download the app and follow the installation prompt on their phone.
            </p>
          </div>
          <div className="feature-grid">
            <article className="feature"><strong>Patient accounts</strong><span>Create an account and keep your session active until you log out or remove the app.</span></article>
            <article className="feature"><strong>Appointment booking</strong><span>Request first-visit or follow-up appointments and track their status.</span></article>
            <article className="feature"><strong>Secure payment</strong><span>Appointment payments are handled before an appointment is confirmed.</span></article>
            <article className="feature"><strong>Notifications</strong><span>Patients receive updates about account and appointment activity.</span></article>
          </div>
        </div>
      </section>

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

      <footer>
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES</span>
          <span>Quality healthcare, made simple.</span>
        </div>
      </footer>
    </main>
  );
}