import { useEffect, useState, type ComponentType } from "react";
import ABFHomepage from "./components/mockups/ABFHomepage";
import ABFAboutUs from "./components/mockups/ABFAboutUs";
import ABFProjects from "./components/mockups/ABFProjects";
import ABFLatest from "./components/mockups/ABFLatest";
import ABFTeam from "./components/mockups/ABFTeam";
import ABFGetInvolved from "./components/mockups/ABFGetInvolved";
import { modules as discoveredModules } from "./.generated/mockup-components";

type ModuleMap = Record<string, () => Promise<Record<string, unknown>>>;

function _resolveComponent(
  mod: Record<string, unknown>,
  name: string,
): ComponentType | undefined {
  const fns = Object.values(mod).filter(
    (v) => typeof v === "function",
  ) as ComponentType[];
  return (
    (mod.default as ComponentType) ||
    (mod.Preview as ComponentType) ||
    (mod[name] as ComponentType) ||
    fns[fns.length - 1]
  );
}

function PreviewRenderer({
  componentPath,
  modules,
}: {
  componentPath: string;
  modules: ModuleMap;
}) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setComponent(null);
    setError(null);

    async function loadComponent(): Promise<void> {
      const key = `./components/mockups/${componentPath}.tsx`;
      const loader = modules[key];
      if (!loader) {
        setError(`No component found at ${componentPath}.tsx`);
        return;
      }

      try {
        const mod = await loader();
        if (cancelled) {
          return;
        }
        const name = componentPath.split("/").pop()!;
        const comp = _resolveComponent(mod, name);
        if (!comp) {
          setError(
            `No exported React component found in ${componentPath}.tsx\n\nMake sure the file has at least one exported function component.`,
          );
          return;
        }
        setComponent(() => comp);
      } catch (e) {
        if (cancelled) {
          return;
        }

        const message = e instanceof Error ? e.message : String(e);
        setError(`Failed to load preview.\n${message}`);
      }
    }

    void loadComponent();

    return () => {
      cancelled = true;
    };
  }, [componentPath, modules]);

  if (error) {
    return (
      <pre style={{ color: "red", padding: "2rem", fontFamily: "system-ui" }}>
        {error}
      </pre>
    );
  }

  if (!Component) return null;

  return <Component />;
}

function getBasePath(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, "");
}

function getPreviewExamplePath(): string {
  const basePath = getBasePath();
  return `${basePath}/preview/ComponentName`;
}

function Gallery() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Component Preview Server
        </h1>
        <p className="text-gray-500 mb-4">
          This server renders individual components for the workspace canvas.
        </p>
        <p className="text-sm text-gray-400">
          Access component previews at{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
            {getPreviewExamplePath()}
          </code>
        </p>
      </div>
    </div>
  );
}

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Sync state on navigation changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);

    // Override pushState to intercept SPA-style programmatic transitions
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  const basePath = getBasePath();
  const normalizedPath =
    basePath && currentPath.startsWith(basePath)
      ? currentPath.slice(basePath.length) || "/"
      : currentPath;

  // 1. Check if the path targets the Replit Dynamic Preview system
  const previewMatch = normalizedPath.match(/^\/preview\/(.+)$/);
  if (previewMatch) {
    const componentPath = previewMatch[1];
    return (
      <PreviewRenderer
        componentPath={componentPath}
        modules={discoveredModules}
      />
    );
  }

  // 2. Production URL Routing mapping
  const path = normalizedPath.toLowerCase();
  
  if (path === "/" || path === "") {
    return <ABFHomepage />;
  }
  if (path.startsWith("/about")) {
    return <ABFAboutUs />;
  }
  if (path.startsWith("/projects")) {
    return <ABFProjects />;
  }
  if (path.startsWith("/latest") || path.startsWith("/latest-from-abf")) {
    return <ABFLatest />;
  }
  if (path.startsWith("/team") || path.startsWith("/meet-the-team")) {
    return <ABFTeam />;
  }
  if (path.startsWith("/get-involved")) {
    return <ABFGetInvolved />;
  }

  // Gallery view fallback (available at /gallery or similar unknown paths for debugging)
  if (path.startsWith("/gallery")) {
    return <Gallery />;
  }

  // Default fallback for any unmatched paths to protect production UX
  return <ABFHomepage />;
}

export default App;
