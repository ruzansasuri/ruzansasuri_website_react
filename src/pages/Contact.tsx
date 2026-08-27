import RawMain from "../components/RawMain";
import html from "../partials/contact-main.html?raw";

export default function Contact() {
  return <RawMain mainClassName="flex-shrink-0" html={html} />;
}
