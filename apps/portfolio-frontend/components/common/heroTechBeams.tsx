"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { IconType } from "react-icons";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiRedux,
  SiTailwindcss,
  SiFigma,
  SiGithub,
  SiPostman,
  SiNpm,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiPython,
  SiCplusplus,
  SiPostgresql,
  SiMongodb,
  SiDocker,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { TbTopologyStar3, TbHierarchy3, TbDatabaseCog } from "react-icons/tb";
import { cn } from "@/lib/utils";
import profile from "@/assets/portfolio.jpeg";

// ── Motion tuning ─────────────────────────────────────────────────────────────
const IDLE_SPEED = 0.1; // resting spin, degrees per frame (higher = faster)
const FRICTION = 0.95; // momentum decay per frame after releasing a drag
const INNER_FACTOR = -1.35; // inner ring: opposite direction (gears) + a bit faster
const MAX_VELOCITY = 30; // clamp fling speed, degrees per frame

type Tech = { name: string; Icon: IconType; color?: string };

// Inner ring — Front-end technologies + tools
const innerRing: Tech[] = [
  { name: "HTML5", Icon: SiHtml5, color: "#E34F26" },
  { name: "CSS", Icon: SiCss, color: "#1572B6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "Redux", Icon: SiRedux, color: "#764ABC" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#38BDF8" },
  { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
  { name: "GitHub", Icon: SiGithub },
  { name: "Postman", Icon: SiPostman, color: "#FF6C37" },
  { name: "npm", Icon: SiNpm, color: "#CB3837" },
];

// Outer ring — Back-end • Languages • DevOps • Database • Design
const outerRing: Tech[] = [
  { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Express.js", Icon: SiExpress },
  { name: "Nest.js", Icon: SiNestjs, color: "#E0234E" },
  { name: "Python", Icon: SiPython, color: "#3776AB" },
  { name: "C++", Icon: SiCplusplus, color: "#00599C" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "AWS", Icon: FaAws, color: "#FF9900" },
  { name: "System Design", Icon: TbTopologyStar3, color: "#22C55E" },
  { name: "Architecture Design", Icon: TbHierarchy3, color: "#22C55E" },
  { name: "Database Design", Icon: TbDatabaseCog, color: "#22C55E" },
];

/** One icon chip on a ring; counter-rotates via `spinVar` so the logo stays upright. */
function OrbitIcon({
  tech,
  angleDeg,
  radiusPct,
  spinVar,
}: {
  tech: Tech;
  angleDeg: number;
  radiusPct: number;
  spinVar: string;
}) {
  const a = (angleDeg * Math.PI) / 180;
  // Round so SSR and client emit identical strings (avoids hydration mismatch).
  const left = (50 + radiusPct * Math.cos(a)).toFixed(4);
  const top = (50 + radiusPct * Math.sin(a)).toFixed(4);
  const Icon = tech.Icon;

  return (
    <div
      className="pointer-events-auto absolute"
      style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -50%)" }}
    >
      <div
        title={tech.name}
        style={{ transform: `rotate(calc(-1 * var(${spinVar}, 0deg)))` }}
        className="flex size-8 items-center justify-center rounded-full border border-green-500/30 bg-[#0f1524] shadow-[0_0_20px_-8px_rgba(34,197,94,0.55)] sm:size-10 md:size-12"
      >
        <Icon
          className={cn("size-4 md:size-5", !tech.color && "text-white")}
          style={tech.color ? { color: tech.color } : undefined}
        />
      </div>
    </div>
  );
}

export default function HeroTechBeams({
  centerRef,
}: {
  centerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rotation = useRef(0); // outer-ring angle (deg) — single source of truth
  const velocity = useRef(IDLE_SPEED); // deg/frame; carries momentum + idle
  const dragging = useRef(false);
  const lastAngle = useRef(0);

  const apply = () => {
    const el = wrapperRef.current;
    if (!el) return;
    el.style.setProperty("--ring-rot", `${rotation.current}deg`);
    el.style.setProperty("--ring-rot-inner", `${rotation.current * INNER_FACTOR}deg`);
  };

  // Animation loop: momentum decays into a steady idle spin (rAF pauses when hidden).
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (!dragging.current) {
        rotation.current += velocity.current;
        velocity.current *= FRICTION;
        // never fully stop — settle into a gentle idle spin, keeping direction
        const sign = velocity.current < 0 ? -1 : 1;
        if (Math.abs(velocity.current) < IDLE_SPEED) velocity.current = IDLE_SPEED * sign;
        apply();
      }
      raf = requestAnimationFrame(loop);
    };
    apply();
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const angleAt = (clientX: number, clientY: number) => {
    const r = wrapperRef.current!.getBoundingClientRect();
    return (
      (Math.atan2(clientY - (r.top + r.height / 2), clientX - (r.left + r.width / 2)) *
        180) /
      Math.PI
    );
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    velocity.current = 0; // stop momentum while grabbing
    lastAngle.current = angleAt(e.clientX, e.clientY);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const a = angleAt(e.clientX, e.clientY);
    let delta = a - lastAngle.current;
    if (delta > 180) delta -= 360;
    else if (delta < -180) delta += 360;
    rotation.current += delta; // follows the drag: clockwise or anti-clockwise
    // smooth the angular velocity so the release fling feels natural
    velocity.current = Math.max(
      -MAX_VELOCITY,
      Math.min(MAX_VELOCITY, velocity.current * 0.6 + delta * 0.4),
    );
    lastAngle.current = a;
    apply(); // synchronous — drag is instant even without rAF
  };

  const endDrag = () => {
    // hand momentum back to the animation loop
    dragging.current = false;
  };

  return (
    <div className="mx-auto flex w-full flex-col items-center">
      <div className="relative aspect-square w-full max-w-[520px] select-none">
        {/* Orbit guide rings */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-green-500/15 [height:86%] [width:86%]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-green-500/15 [height:54%] [width:54%]" />
        </div>

        {/* Interactive wrapper holding the two counter-rotating ring layers */}
        <div
          ref={wrapperRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          style={{ touchAction: "none" }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          {/* Inner ring — spins opposite (gears effect) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ transform: "rotate(var(--ring-rot-inner, 0deg))" }}
          >
            {innerRing.map((t, i) => (
              <OrbitIcon
                key={t.name}
                tech={t}
                angleDeg={(360 / innerRing.length) * i - 90}
                radiusPct={27}
                spinVar="--ring-rot-inner"
              />
            ))}
          </div>

          {/* Outer ring — follows the drag */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ transform: "rotate(var(--ring-rot, 0deg))" }}
          >
            {outerRing.map((t, i) => (
              <OrbitIcon
                key={t.name}
                tech={t}
                angleDeg={(360 / outerRing.length) * i - 90}
                radiusPct={43}
                spinVar="--ring-rot"
              />
            ))}
          </div>
        </div>

        {/* Center — profile image (fixed) */}
        <div
          ref={centerRef}
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 aspect-square w-1/3 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-green-500/60 bg-white shadow-[0_0_60px_-8px_rgba(34,197,94,0.8)] dark:bg-[#0f1524]"
        >
          <Image
            src={profile}
            alt="Amdadul HQ"
            fill
            draggable={false}
            sizes="(max-width: 768px) 130px, 180px"
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* Hint */}
      <p className="mt-1 text-xs text-muted-foreground">
        ↻ Drag the ring to spin — fling it to keep it going
      </p>
    </div>
  );
}
