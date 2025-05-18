"use client"
// import AboutUs from "./aboutus";
// import Projects from "./project";
// import Skills from "./skills";
// import Experience from "./experience";
// import { RevealLinks } from "./RevealLinks";

import { useEffect, useState } from "react";
import AboutMe from "./aboutme";
import Experience from "./exprience";
import Skills from "./skills";
const ScrollStack =()=> {
 const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop - 50 && window.scrollY < sectionTop + sectionHeight) {
          const sectionId = section.getAttribute('id');
          console.log('Current Section:', sectionId); // Log active section
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
      <main>
        <article>
          <section className="h-screen sticky top-0" id="aboutus">
            <AboutMe />
          </section>
          <section className="h-screen  w-full sticky -top-32 md:top-0 mb-10" id="experience">
            <Experience />
          </section>
          <section className="h-screen sticky top-0" id="skills">
            <Skills />
          </section>
          <section className="h-screen sticky top-0" id="projects">
            {/* <Projects /> */}
          </section>
          <section className="bg-green-300 rounded-t-[80px]  sticky top-10 md:top-0" id="links">
            {/* <RevealLinks /> */}
          </section>
        </article>
      </main>
  );
}

export default ScrollStack;