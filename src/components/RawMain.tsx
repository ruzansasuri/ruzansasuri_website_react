import Navbar from "./Navbar";

interface RawMainProps {
  mainClassName: string;
  html: string;
}

// Reproduces: <main class="..."> [navbar injected afterbegin] [original content] </main>
export default function RawMain({ mainClassName, html }: RawMainProps) {
  return (
    <main className={mainClassName}>
      <Navbar />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
