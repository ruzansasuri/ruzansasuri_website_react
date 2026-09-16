import RawMain from "../components/RawMain";
import html from "../partials/projects-main.html?raw";

export default function Repos() {
  return <RawMain mainClassName="flex-shrink-0" html={html} />;
}
