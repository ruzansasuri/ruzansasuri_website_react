import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, "..", "src", "data", "projectsManifest.json");
const vercelJsonPath = path.join(__dirname, "..", "vercel.json");

const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

const projectRewrites = manifest
  .filter((project) => typeof project.deployUrl === "string" && project.deployUrl.trim().length > 0)
  .map((project) => ({
    source: `/projects/${project.slug}`,
    destination: project.deployUrl,
  }));

const vercelConfig = {
  rewrites: [...projectRewrites, { source: "/(.*)", destination: "/index.html" }],
};

writeFileSync(vercelJsonPath, `${JSON.stringify(vercelConfig, null, 2)}\n`);

console.log(`Generated vercel.json with ${projectRewrites.length} project rewrite(s).`);
