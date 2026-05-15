import { Hero } from "../sections/Hero";
import { Services } from "../sections/Services";
import { Process } from "../sections/Process";
import { Portfolio } from "../sections/Portfolio";
import { FAQ } from "../sections/FAQ";
import { Contact } from "../sections/Contact";

export const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <Process />
      <Portfolio />
      <FAQ />
      <Contact />
    </>
  );
};
