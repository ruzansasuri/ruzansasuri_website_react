import RawMain from "../components/RawMain";
import html from "../partials/index-main.html?raw";

export default function Home() {
  return <RawMain mainClassName="flex-shrink-0" html={html} />;
}
