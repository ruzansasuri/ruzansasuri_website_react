import RawMain from "../components/RawMain";
import html from "../partials/skills-main.html?raw";

export default function Skills() {
  return <RawMain mainClassName="flex-shrink-0" html={html} />;
}
