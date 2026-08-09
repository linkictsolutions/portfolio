import { IntroLoader } from "@/components/intro-loader";
import { Hero } from "@/components/home/hero";
import { WorkIndex } from "@/components/home/work-index";
import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";

export default function Home() {
  return (
    <>
      <IntroLoader />
      <main>
        <Hero />
        <WorkIndex />
        <About />
        <Contact />
      </main>
    </>
  );
}
