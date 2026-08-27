import Navbar from "../components/Navbar";
import premainHtml from "../partials/stycobot-premain.html?raw";
import mainHtml from "../partials/stycobot-main.html?raw";

// Scoped down for now: renders the raw markup only (modal + chat UI shell).
// The chatbot's own JS (js/stycobot.js, js/stycobotmetrics.js) is not wired
// up yet - that's a follow-up once the pages/nav/footer are confirmed working.
export default function StycoBot() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: premainHtml }} />
      <main className="flex-shrink-0">
        <Navbar />
        <div dangerouslySetInnerHTML={{ __html: mainHtml }} />
      </main>
    </>
  );
}
