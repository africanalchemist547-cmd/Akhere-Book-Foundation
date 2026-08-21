import { useEffect, useState } from "react";
import ABFHomepage from "./components/mockups/ABFHomepage";
import ABFAboutUs from "./components/mockups/ABFAboutUs";
import ABFProjects from "./components/mockups/ABFProjects";
import ABFLatest from "./components/mockups/ABFLatest";
import ABFTeam from "./components/mockups/ABFTeam";
import ABFGetInvolved from "./components/mockups/ABFGetInvolved";
import { AdminAuthProvider } from "./components/admin/AdminAuthContext";
import AdminLayout from "./components/admin/AdminLayout";

// Production client-side router for the Akhere Book Foundation website.
// Workflow: Antigravity → GitHub → Netlify
//
// Routes:
//   /                  → Homepage
//   /about             → About Us
//   /projects          → Projects
//   /latest-from-abf   → Latest from ABF
//   /meet-the-team     → Meet the Team
//   /get-involved      → Get Involved / Volunteer
//   /admin             → Unified Admin Dashboard & CMS
//
// SPA fallback: Netlify serves index.html for all paths (netlify.toml [[redirects]])
// so hard refreshes and direct URL access work on all routes.

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);

    // Intercept pushState so in-app navigation triggers re-render
    const originalPushState = window.history.pushState.bind(window.history);
    window.history.pushState = (...args) => {
      originalPushState(...args);
      setCurrentPath(window.location.pathname);
    };

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.history.pushState = originalPushState;
    };
  }, []);

  const path = currentPath.toLowerCase().replace(/\/+$/, "") || "/";

  // Admin routes
  if (path.startsWith("/admin")) {
    const sub = path.replace(/^\/admin\/?/, "");
    const initialTab = sub || "overview";
    return (
      <AdminAuthProvider>
        <AdminLayout initialTab={initialTab} />
      </AdminAuthProvider>
    );
  }

  if (path === "/") return <ABFHomepage />;
  if (path.startsWith("/about")) return <ABFAboutUs />;
  if (path.startsWith("/projects")) return <ABFProjects />;
  if (path.startsWith("/latest")) return <ABFLatest />;
  if (path.startsWith("/meet-the-team") || path.startsWith("/team")) return <ABFTeam />;
  if (path.startsWith("/get-involved")) return <ABFGetInvolved />;

  // Default: homepage for any unmatched path
  return <ABFHomepage />;
}

export default App;
