"use client"
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ScrollElement from "@/components/ui/scroll-element";
import { FlipWords } from "@/components/ui/flip-wors";
import { RevealLinks } from "@/components/common/RevealLinks";
import { twMerge } from "tailwind-merge";
import profile1 from '../assets/profile1.png'

interface CardProps {
  containerRef: React.RefObject<HTMLDivElement>;
  src: string;
  alt: string;
  top: string;
  left: string;
  rotate: string;
  className?: string;
}
const AboutsPage = () => {
  const words = [
    "Creative",
    "Innovative",
    "Dynamic",
    "Interactive",
    "Visionary",
    "Passionate",
    "Adaptive",
    "Tech-Savvy",
    "Problem-Solving",
    "Skilled",
    "Experienced",
    "Efficient",
    "Impactful",
    "Curious",
    "Collaborative",
    "Frontend",
    "Backend",
    "Full-Stack",
    "Freelance",
    "Pixel-Perfect",
    "Cutting-Edge",
    "Scalable",
    "Empathetic",
    "Versatile",
    "Growth-Focused",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      {/* <SEO
        title="About Us"
        description="Welcome to my portfolio website. I'm a Full Stack Developer specializing in modern web technologies."
        path="/about"
      /> */}
      <section className="relative grid min-h-screen w-full place-content-center overflow-hidden bg-[#fff]]">
        <h2 className="relative z-0 text-[14vw] font-black text-neutral-800 md:text-[200px]">
          Amdadul HQ<span className="text-orange-500">.</span>
        </h2>
      </section>
      <div className="overflow-hidden min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-20 space-y-32">
          <ScrollElement
            direction="top"
            viewport={{ amount: 0.3, margin: "0px 0px 0px 0px" }}
            className="flex flex-col items-start"
          >
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 p-8">
              I&apos;m Amdadul HQ,{" "}
              <FlipWords
                className="bg-gradient-to-r from-green-600 to-green-400 text-white px-4 py-2 rounded-xl shadow-lg"
                words={words}
              />{" "}
              <span className="block mt-4">
                Full Stack Developer living in Dhaka & Focus on making digital experiences
                that are easy to use, enjoyable & get the job done.
              </span>
            </div>
          </ScrollElement>

          {/* <ScrollElement
            direction="top"
            viewport={{ amount: 0.3, margin: '0px 0px 0px 0px' }}
          >
            <div className="p-8 rounded-2xl transition-all duration-500 ">
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-gray-800">
                As a <span className="font-semibold text-green-600">Full Stack Developer</span> at Sinss Digital Marketing Studio since Dec 2023, I've built e-commerce platforms, CRMs, and project management tools using the MERN stack, Next.js, PostgreSQL, and MySQL. I've also independently designed and developed over eight websites, turning ideas into impactful solutions.
              </p>
            </div>
          </ScrollElement>

          <ScrollElement
            direction="top"
            viewport={{ amount: 0.3, margin: '0px 0px 0px 0px' }}
            className="group"
          >
            <div className="p-8 rounded-2xl ">
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-gray-800">
                Previously, during my <span className="font-semibold text-green-600">React Developer Internship</span> at Nectarglob Technologies (Dec 2023–Mar 2024), I contributed to a SharePoint-based CRM application, gaining valuable experience in enterprise workflows.
              </p>
            </div>
          </ScrollElement>

          <ScrollElement
            direction="top"
            viewport={{ amount: 0.3, margin: '0px 0px 0px 0px' }}
            className="group"
          >
            <div className="p-8 rounded-2xl">
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed ">
                With expertise in <span className="font-semibold text-green-400">React.js</span>, <span className="font-semibold text-green-400">Node.js</span>, and scalable databases, I'm passionate about creating user-focused applications that make a difference.
              </p>
            </div>
          </ScrollElement> */}
          <ScrollElement
            direction="top"
            viewport={{ amount: 0.3, margin: "0px 0px 0px 0px" }}
          >
            <div className="p-8 rounded-2xl transition-all duration-500">
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-gray-800">
                Passionate{" "}
                <span className="font-semibold text-green-600">
                  Full-Stack Developer
                </span>{" "}
                with 1+ years of experience building scalable and user-focused
                web applications. Skilled in the{" "}
                <span className="font-semibold text-green-400">MERN stack</span>{" "}
                (MongoDB, Express, React, Node.js),{" "}
                <span className="font-semibold text-green-400">Next.js</span>,{" "}
                <span className="font-semibold text-green-400">PostgreSQL</span>
                , and{" "}
                <span className="font-semibold text-green-400">MySQL</span>. I
                focus on writing clean code, crafting intuitive UI/UX, and
                delivering impactful solutions from concept to deployment.
              </p>
            </div>
          </ScrollElement>

          <ScrollElement
            direction="top"
            viewport={{ amount: 0.3, margin: "0px 0px 0px 0px" }}
            className="group"
          >
            <div className="p-8 rounded-2xl">
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-gray-800">
                As a{" "}
                <span className="font-semibold text-green-600">
                  Freelance Full-Stack Developer
                </span>
                , I’ve successfully designed and developed over eight websites,
                turning client ideas into fully functional, user-centric
                solutions. My freelance projects span e-commerce platforms,
                CRMs, and portfolio sites, all crafted with performance and
                scalability in mind.
              </p>
            </div>
          </ScrollElement>

          <ScrollElement
            direction="top"
            viewport={{ amount: 0.3, margin: "0px 0px 0px 0px" }}
            className="group"
          >
            <div className="p-8 rounded-2xl">
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-gray-800">
                With expertise in{" "}
                <span className="font-semibold text-green-400">React.js</span>,{" "}
                <span className="font-semibold text-green-400">Node.js</span>,
                and scalable databases, I’m passionate about creating
                user-focused applications that not only solve problems but also
                deliver exceptional user experiences.
              </p>
            </div>
          </ScrollElement>
        </div>
      </div>

      <RevealLinks />
    </>
  );
};

export default AboutsPage;
