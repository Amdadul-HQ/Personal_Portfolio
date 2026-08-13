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
      <section className="relative grid min-h-screen w-full place-content-center overflow-hidden">
        <h2 className="relative z-0 text-[14vw] font-black text-neutral-800 dark:text-white md:text-[200px]">
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
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white p-8">
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
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-gray-800 dark:text-gray-300">
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
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-gray-800 dark:text-gray-300">
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
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-gray-800 dark:text-gray-300">
                <span className="font-semibold text-green-600">
                  Full-stack engineer
                </span>{" "}
                with 3+ years building production systems in{" "}
                <span className="font-semibold text-green-400">Node.js</span>{" "}
                and{" "}
                <span className="font-semibold text-green-400">Next.js</span>.
                Core engineer on{" "}
                <span className="font-semibold text-green-400">LeadPylot</span>{" "}
                at Digital Pylot — a multi-tenant CRM SaaS spanning 14
                microservices — where I own the PDF form-mapping and generation
                engine, three-tier RBAC, a two-way IMAP email client, and
                multi-channel realtime notifications.
              </p>
            </div>
          </ScrollElement>

          <ScrollElement
            direction="top"
            viewport={{ amount: 0.3, margin: "0px 0px 0px 0px" }}
            className="group"
          >
            <div className="p-8 rounded-2xl">
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-gray-800 dark:text-gray-300">
                Before that, I led{" "}
                <span className="font-semibold text-green-600">
                  20 developers
                </span>{" "}
                as Backend Team Lead at Softvence — delivering 7–8
                service-based projects under tight deadlines — and contributed
                to{" "}
                <span className="font-semibold text-green-400">
                  20+ client websites
                </span>{" "}
                at Monster Studio, from custom CMS builds with YouTube API
                integration to SEO-optimised UIs with{" "}
                <span className="font-semibold text-green-400">Remix</span>,{" "}
                <span className="font-semibold text-green-400">React</span>, and{" "}
                <span className="font-semibold text-green-400">
                  Tailwind CSS
                </span>
                .
              </p>
            </div>
          </ScrollElement>

          <ScrollElement
            direction="top"
            viewport={{ amount: 0.3, margin: "0px 0px 0px 0px" }}
            className="group"
          >
            <div className="p-8 rounded-2xl">
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-gray-800 dark:text-gray-300">
                My depth is in{" "}
                <span className="font-semibold text-green-400">
                  document automation
                </span>
                ,{" "}
                <span className="font-semibold text-green-400">
                  realtime systems
                </span>
                , and{" "}
                <span className="font-semibold text-green-400">
                  Redis-backed performance work
                </span>{" "}
                — and I’m passionate about creating user-focused applications
                that not only solve problems but also deliver exceptional user
                experiences.
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
