export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__copy">
        Jonathan Shanmuganantham — {new Date().getFullYear()}
      </p>
      <div className="footer__links">
        <a
          href="https://github.com/jshan9078"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__link"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/jonathanshan1/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__link"
        >
          LinkedIn
        </a>
        <a href="mailto:jshan9078@gmail.com" className="footer__link">
          Email
        </a>
      </div>
    </footer>
  );
}
