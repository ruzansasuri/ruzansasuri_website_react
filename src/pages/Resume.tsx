import RawMain from "../components/RawMain";
import html from "../partials/resume-main.html?raw";

export default function Resume() {
  return <RawMain mainClassName="flex-shrink-0" html={html} />;
}
