import RawMain from "../components/RawMain";
import html from "../partials/projects-main.html?raw";

export default function Projects() {
  return <RawMain mainClassName="flex-shrink-0" html={html} />;
}
