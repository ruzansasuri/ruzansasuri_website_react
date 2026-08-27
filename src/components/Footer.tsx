import { Link } from "react-router-dom";

// Mirrors js/footer.js exactly: same markup, classes, and gradient background,
// internal links use <Link> for client-side nav, external GitHub link unchanged.
export default function Footer() {
  return (
    <footer
      className="py-5 mt-auto"
      style={{ background: "linear-gradient(180deg, rgba(30, 48, 243, 0.05), rgba(226, 30, 128, 0.05))" }}
    >
      <div className="container px-5">
        <div className="row gy-4">
          <div className="col-6 col-md-3">
            <h6 className="fw-bolder mb-3">Site Map</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link className="link-secondary text-decoration-none" to="/">Home</Link>
              </li>
              <li className="mb-2">
                <Link className="link-secondary text-decoration-none" to="/resume">Resume</Link>
              </li>
              <li className="mb-2">
                <Link className="link-secondary text-decoration-none" to="/skills">Skills</Link>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="fw-bolder mb-3">Work</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link className="link-secondary text-decoration-none" to="/projects">Projects</Link>
              </li>
              <li className="mb-2">
                <Link className="link-secondary text-decoration-none" to="/stycobot">StycoBot</Link>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="fw-bolder mb-3">Connect</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link className="link-secondary text-decoration-none" to="/contact">Contact</Link>
              </li>
              <li className="mb-2">
                <a
                  className="link-secondary text-decoration-none"
                  href="https://github.com/ruzansasuri"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="fw-bolder mb-3">Ruzan Sasuri</h6>
            <p className="small text-muted mb-0">Fullstack Software Engineer</p>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row align-items-center">
          <div className="col-auto small text-muted">&copy; {new Date().getFullYear()} Ruzan Sasuri</div>
        </div>
      </div>
    </footer>
  );
}
