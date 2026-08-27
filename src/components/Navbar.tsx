import { Link, useLocation } from "react-router-dom";

// Mirrors js/navbar.js exactly: same markup/classes, same active-link logic
// (currentPage derived from pathname), but uses <Link> for client-side nav
// instead of full page reloads.
const NAV_ITEMS: { label: string; path: string; key: string }[] = [
  { label: "Home", path: "/", key: "index" },
  { label: "Resume", path: "/resume", key: "resume" },
  { label: "Skills", path: "/skills", key: "skills" },
  { label: "Projects", path: "/projects", key: "projects" },
  { label: "StycoBot", path: "/stycobot", key: "stycobot" },
  { label: "Contact", path: "/contact", key: "contact" },
];

export default function Navbar() {
  const location = useLocation();
  // Original: window.location.pathname.split('/').pop().replace('.html', '') || 'index'
  const currentPage = location.pathname.split("/").pop()?.replace(".html", "") || "index";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white py-3">
      <div className="container px-5">
        <Link className="navbar-brand" to="/">
          <span className="fw-bolder text-primary">Ruzan Sasuri's Portfolio</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 small fw-bolder">
            {NAV_ITEMS.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  className={`nav-link${currentPage === item.key ? " active" : ""}`}
                  to={item.path}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
