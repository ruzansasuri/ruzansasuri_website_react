import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";

// Exact body classes from each original static page - preserved verbatim.
const BODY_CLASSES: Record<string, string> = {
  "/": "d-flex flex-column h-100",
  "/resume": "d-flex flex-column h-100 bg-light",
  "/skills": "d-flex flex-column h-100 bg-light",
  "/projects": "d-flex flex-column h-100 bg-light",
  "/stycobot": "d-flex flex-column h-100 bg-light",
  "/contact": "d-flex flex-column",
};

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    const classes = BODY_CLASSES[location.pathname] ?? "d-flex flex-column h-100";
    document.body.className = classes;
  }, [location.pathname]);

  return (
    <>
      {/* Original: navbar.js injects nav as first child INSIDE <main> (afterbegin),
          so Navbar is rendered inside each Page's <main>, not here. */}
      <Outlet />
      {/* Original: footer.js injects footer AFTER </main> (afterend) - matches here. */}
      <Footer />
    </>
  );
}
