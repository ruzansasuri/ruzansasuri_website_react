import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import manifest from "../data/projectsManifest.json";
import type { ProjectManifestEntry } from "../types/project";
import "./projects-hub.css";

const projects = manifest as ProjectManifestEntry[];

function ProjectsHubContent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="flex-shrink-0 projects-hub" data-theme={theme}>
      <Navbar />
      <div className="container px-5 py-5">
        <div className="projects-hub__header">
          <h1 className="fw-bolder">Projects</h1>
          <button
            type="button"
            className="projects-hub__theme-toggle"
            onClick={toggleTheme}
            aria-pressed={theme === "night"}
          >
            {theme === "night" ? "Switch to day" : "Switch to night"}
          </button>
        </div>
        <div className="projects-hub__grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              name={project.name}
              description={project.description}
              thumbnail={project.thumbnail}
              videoUrl={project.videoUrl}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function Projects() {
  return (
    <ThemeProvider>
      <ProjectsHubContent />
    </ThemeProvider>
  );
}
