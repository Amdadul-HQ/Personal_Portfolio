import React from "react";
import { motion } from "framer-motion";

export const RevealLinks = () => {
  return (
    <section className="grid  w-full gap-2 bg-green-300 px-8 py-24 text-black rounded-t-[80px] dark:bg-green-950 dark:text-green-100">
      <div className="flex flex-col md:flex-row gap-y-4 justify-between container gap-x-3 mx-auto">
        <div className="flex flex-col">
          <p className="text-4xl font-semibold mb-3">
          Amdadul-HQ
          </p>
        <div>
          <p className="mx-auto text-black dark:text-green-100/80">
          Let's build something amazing together.<br/> I'm available for freelance projects, collaborations, and full-time
          opportunities.<br/> Drop me a message, and let's discuss how we can turn your ideas into reality.
        </p>
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-y-3 mb-3">
        <FlipLink href="https://www.linkedin.com/in/Amdadul-Haque-Bhuiyan">Linkedin</FlipLink>
        <FlipLink href="https://github.com/Amdadul-HQ">Github</FlipLink>
        <FlipLink href="https://x.com/hoque_amdaul">Twitter</FlipLink>
        <FlipLink href="https://www.facebook.com/amdadul.haque.54540218">Facebook</FlipLink>
        </div>
      </div>
      </div>
        <div>
          <div className="text-sm text-black mt-3 text-center dark:text-green-200/70">Copyright © 2025 - All rights reserved by Amdadul_HQ</div>
        </div>
    </section>
  );
};

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ children, href }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-xl font-black uppercase md:text-4xl lg:text-4xl"
      style={{
        lineHeight: 0.90,
      }}
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: 0,
              },
              hovered: {
                y: "-100%",
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: "100%",
              },
              hovered: {
                y: 0,
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};