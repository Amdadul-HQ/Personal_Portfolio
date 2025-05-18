import React from "react";
import { motion } from "framer-motion";

export const RevealLinks = () => {
  return (
    <section className="grid  w-full gap-2 bg-green-300 px-8 py-24 text-black rounded-t-[80px]">
      <div className="flex justify-between container gap-x-3 mx-auto">
        <div className="flex flex-col">
          <p className="text-4xl font-semibold mb-3">
          Amdadul-HQ
          </p>
        <div>
          <p className="mx-auto text-black">
          Let's build something amazing together.<br/> I'm available for freelance projects, collaborations, and full-time
          opportunities.<br/> Drop me a message, and let's discuss how we can turn your ideas into reality.
        </p>
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-y-3 mb-3">
        <FlipLink href="https://www.linkedin.com/in/durgesh-bachhav-914bb8337/">Linkedin</FlipLink>
        <FlipLink href="https://www.instagram.com/durgesh.bachhav_">Github</FlipLink>
        <FlipLink href="https://www.instagram.com/durgesh.bachhav_">Twitter</FlipLink>
        <FlipLink href="https://www.instagram.com/durgesh.bachhav_">Facebook</FlipLink>
        </div>
      </div>
      </div>
        <div>
          <div className="text-sm text-black mt-3 text-center">Copyright © 2025 - All rights reserved by Amdadul_HQ</div>
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
      className="relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-4xl"
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