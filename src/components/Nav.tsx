import { useEffect, useState } from "react";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollToTarget = (targetId: string) => {
    const isHomeRoute = window.location.pathname === "/";
    if (!isHomeRoute) return;
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 60;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const handleNavClick = (_e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMenuOpen(false);
    scrollToTarget(targetId);
  };

  const handleMobileNavClick = (_e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMenuOpen(false);
    scrollToTarget(targetId);
  };

  return (
    <>
      <nav className="nav">
        <div className="nav__container">
          <a href="/" className="nav__logo">
            JS
          </a>
          <div className="nav__links-wrapper">
            <ul className="nav__links">
              <li>
                <a
                  href="/#experience"
                  className="nav__link"
                  onClick={(e) => handleNavClick(e, "experience")}
                >
                  Experience
                </a>
              </li>
              <li>
                <a
                  href="/#projects"
                  className="nav__link"
                  onClick={(e) => handleNavClick(e, "projects")}
                >
                  Projects
                </a>
              </li>
              {/*<li>
                <a
                  href="/agents"
                  className="nav__link nav__link--shimmer"
                >
                  Agents
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/jshan9078/zera"
                  className="nav__link nav__link--shimmer-pink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Zera
                </a>
              </li>*/}
            </ul>
          </div>
          <button
            className={`nav__mobile-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
      <div className={`nav__mobile-menu ${menuOpen ? "open" : ""}`}>
        <a
          href="/#home"
          className="nav__link"
          onClick={(e) => handleMobileNavClick(e, "home")}
        >
          Home
        </a>
        <a
          href="/#experience"
          className="nav__link"
          onClick={(e) => handleMobileNavClick(e, "experience")}
        >
          Experience
        </a>
        <a
          href="/#projects"
          className="nav__link"
          onClick={(e) => handleMobileNavClick(e, "projects")}
        >
          Projects
        </a>
        {/*<a href="/agents" className="nav__link nav__link--shimmer">
          Agents
        </a>
        <a
          href="https://github.com/jshan9078/zera"
          className="nav__link nav__link--shimmer-pink"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zera
        </a>*/}
      </div>
    </>
  );
}
