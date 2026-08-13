"use client"
// import AboutUs from "./aboutus";
// import Projects from "./project";
// import Skills from "./skills";
// import Experience from "./experience";

import { useEffect, useState } from "react";
import AboutMe from "./aboutme";
import Experience from "./exprience";
import Skills from "./skills";
import Projects from "./featureProject";
import { RevealLinks } from "./RevealLinks";
import { PopularBlogs } from "./blogs";

const ScrollStack =()=> {
 const [activeSection, setActiveSection] = useState<string|null>(null);
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop - 50 && window.scrollY < sectionTop + sectionHeight) {
          const sectionId = section.getAttribute('id');
          // console.log('Current Section:', sectionTop,sectionHeight); // Log active section
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
          {/* NOT sticky: a pinned about-me stays behind the whole page and peeks
              through rounded corners / any gap in later sections. */}
          <section className="relative w-full" id="aboutus" data-pet-section="about-me">
            <AboutMe />
          </section>
          {/* NOT sticky/h-screen: the experience timeline is taller than one viewport,
              and a fixed-height sticky wrapper clips everything past the first screen.
              `relative` keeps it painting above the pinned section before it.
              No bottom margin — any gap here shows the pinned about-me section behind it. */}
          <section className="relative w-full" id="experience" data-pet-section="experience">
            <Experience />
          </section>
          {/* NOT sticky/h-screen (same clipping issue as experience): the skills
              terminal can be taller than one viewport on smaller screens. */}
          <section className="relative w-full" id="skills" data-pet-section="skills">
            <Skills />
          </section>
          <section className="h-screen sticky top-0" id="projects" data-pet-section="projects">
            <Projects />
          </section>
          <section className="h-screen sticky top-0" id="blogs" data-pet-section="blogs">
            <PopularBlogs />
          </section>
          <section className="bg-green-300 rounded-t-[80px]  sticky top-10 md:top-0 dark:bg-green-950" id="links" data-pet-section="contact">
            <RevealLinks />
          </section>
        </article>
      </main>
  );
}

export default ScrollStack;