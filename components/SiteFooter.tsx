import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer>
      <div className="container footer-inner">
        <div>
          <strong>OMOLOLU HOSPITAL AND DIAGNOSTIC SERVICES</strong>
          <p>Quality Healthcare for You.</p>
        </div>
        <div className="footer-links" aria-label="Legal information">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms and Conditions</Link>
          <Link href="/medical-disclaimer">Medical Disclaimer</Link>
        </div>
        <div className="footer-contact">
          <a href="tel:+2348067489645">+234 806 748 9645</a>
          <a href="tel:+2348033770933">+234 803 377 0933</a>
        </div>
        <span>© {new Date().getFullYear()} Omololu Hospital and Diagnostic Services</span>
      </div>
    </footer>
  );
}
