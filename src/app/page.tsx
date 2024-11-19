import Hero from "../sections/Hero";
import About from "../sections/About";
import WhyUs from "../sections/WhyUs";

export default function Home() {
  return (
    <>
      <Hero />
      <main id="main">
        <About />
        <WhyUs />
      </main>
    </>
  );
}
