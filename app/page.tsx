export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="container nav">
          <div className="brand">
            <span className="brand-mark">O</span>
            <span>OMOLOLU HOSPITAL</span>
          </div>
          <nav aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#doctor">Doctor</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-content">
          <p className="eyebrow">Compassionate care. Trusted service.</p>
          <h1>Welcome to OMOLOLU HOSPITAL</h1>
          <p className="hero-copy">
            A modern hospital website built to provide clear information,
            accessible services and a trusted digital presence for patients
            and the community.
          </p>
          <div className="actions">
            <a className="button primary" href="#contact">Contact the Hospital</a>
            <a className="button secondary" href="#services">View Services</a>
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container">
          <p className="eyebrow">About us</p>
          <h2>Healthcare with people at the centre.</h2>
          <p className="section-copy">
            This section will contain the hospital&apos;s approved history,
            mission, vision and other official information supplied by the
            hospital.
          </p>
        </div>
      </section>

      <section id="services" className="section muted">
        <div className="container">
          <p className="eyebrow">Medical services</p>
          <h2>Services provided by OMOLOLU HOSPITAL</h2>
          <div className="cards">
            {["Consultation", "Medical Care", "Laboratory Services"].map((service) => (
              <article className="card" key={service}>
                <h3>{service}</h3>
                <p>Official service information will be added after confirmation by the hospital.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="doctor" className="section">
        <div className="container">
          <p className="eyebrow">Medical team</p>
          <h2>Meet the Doctor</h2>
          <p className="section-copy">
            The doctor&apos;s approved profile, qualifications, experience and
            professional photograph will be added here.
          </p>
        </div>
      </section>

      <section id="contact" className="section contact">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h2>Get in touch with OMOLOLU HOSPITAL</h2>
          <p className="section-copy">
            Phone, WhatsApp, email, opening hours, address and Google Maps
            information will be added here.
          </p>
        </div>
      </section>

      <footer>
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} OMOLOLU HOSPITAL</span>
          <span>Official Hospital Website</span>
        </div>
      </footer>
    </main>
  );
}