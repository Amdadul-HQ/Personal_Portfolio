"use client";

import React, { createRef, forwardRef, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";

// Profile (center node)
import profile from "@/assets/portfolio.jpeg";

// Tech icons (from /assets)
import js from "@/assets/js.svg";
import typescript from "@/assets/typescript.svg";
import react from "@/assets/react.svg";
import next from "@/assets/next.svg";
import redux from "@/assets/redux.svg";
import tailwind from "@/assets/tailwind.svg";
import node from "@/assets/node.svg";
import express from "@/assets/express.svg";
import mongo from "@/assets/mongo.svg";
import postgresql from "@/assets/postgresql.svg";
import github from "@/assets/github.svg";
import figma from "@/assets/figma.svg";

type Tech = { name: string; icon: StaticImageData };

// Left side — front-end skills
const leftSkills: Tech[] = [
  { name: "JavaScript", icon: js },
  { name: "TypeScript", icon: typescript },
  { name: "React", icon: react },
  { name: "Next.js", icon: next },
  { name: "Redux", icon: redux },
  { name: "Tailwind CSS", icon: tailwind },
];

// Right side — back-end skills & tools
const rightSkills: Tech[] = [
  { name: "Node.js", icon: node },
  { name: "Express", icon: express },
  { name: "MongoDB", icon: mongo },
  { name: "PostgreSQL", icon: postgresql },
  { name: "GitHub", icon: github },
  { name: "Figma", icon: figma },
];

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-11 md:size-12 items-center justify-center rounded-full border border-green-500/30 bg-[#0f1524] p-2.5 shadow-[0_0_20px_-8px_rgba(34,197,94,0.55)]",
        className,
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

export default function HeroTechBeams() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  // Stable ref objects, one per skill on each side.
  const leftRefs = useRef(leftSkills.map(() => createRef<HTMLDivElement>()));
  const rightRefs = useRef(rightSkills.map(() => createRef<HTMLDivElement>()));

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-full max-w-2xl items-center justify-center overflow-hidden py-4"
    >
      <div className="flex w-full items-stretch justify-between gap-3 sm:gap-8">
        {/* Left column */}
        <div className="flex flex-col justify-center gap-3 md:gap-4">
          {leftSkills.map((s, i) => (
            <Circle key={s.name} ref={leftRefs.current[i]}>
              <Image
                src={s.icon}
                alt={s.name}
                width={28}
                height={28}
                className="object-contain"
              />
            </Circle>
          ))}
        </div>

        {/* Center — profile image */}
        <div className="flex flex-col justify-center">
          <div
            ref={centerRef}
            className="relative z-10 size-40 overflow-hidden rounded-full border-2 border-green-500/60 bg-white shadow-[0_0_60px_-8px_rgba(34,197,94,0.8)] md:size-56 dark:bg-[#0f1524]"
          >
            <Image
              src={profile}
              alt="Amdadul HQ"
              fill
              sizes="(max-width: 768px) 160px, 224px"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col justify-center gap-3 md:gap-4">
          {rightSkills.map((s, i) => (
            <Circle key={s.name} ref={rightRefs.current[i]}>
              <Image
                src={s.icon}
                alt={s.name}
                width={28}
                height={28}
                className="object-contain"
              />
            </Circle>
          ))}
        </div>
      </div>

      {/* Beams: every left icon -> center */}
      {leftRefs.current.map((ref, i) => (
        <AnimatedBeam
          key={`left-beam-${i}`}
          containerRef={containerRef}
          fromRef={ref}
          toRef={centerRef}
          duration={4}
          delay={i * 0.25}
        />
      ))}

      {/* Beams: every right icon -> center (reversed gradient flow) */}
      {rightRefs.current.map((ref, i) => (
        <AnimatedBeam
          key={`right-beam-${i}`}
          containerRef={containerRef}
          fromRef={ref}
          toRef={centerRef}
          reverse
          duration={4}
          delay={i * 0.25}
        />
      ))}
    </div>
  );
}
