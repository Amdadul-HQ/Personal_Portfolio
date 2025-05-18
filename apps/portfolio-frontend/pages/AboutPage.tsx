"use client"
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ScrollElement from "@/components/ui/scroll-element";
import { FlipWords } from "@/components/ui/flip-wors";
import { RevealLinks } from "@/components/common/RevealLinks";
import { twMerge } from "tailwind-merge";

interface CardProps {
  containerRef: React.RefObject<HTMLDivElement>;
  src: string;
  alt: string;
  top: string;
  left: string;
  rotate: string;
  className?: string;
}
export const AboutsPage = () => {
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
        <Cards />
      </section>
      <div className="overflow-hidden min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-20 space-y-32">
          <ScrollElement
            direction="top"
            viewport={{ amount: 0.3, margin: "0px 0px 0px 0px" }}
            className="flex flex-col items-start"
          >
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 p-8">
              I&apos;m Durgesh,{" "}
              <FlipWords
                className="bg-gradient-to-r from-green-600 to-green-400 text-white px-4 py-2 rounded-xl shadow-lg"
                words={words}
              />{" "}
              <span className="block mt-4">
                Developer living in Nashik & Focus on making digital experiences
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

const Cards = () => {
   const containerRef = useRef<HTMLDivElement | any>(null);

  return (
    <div className="absolute inset-0 z-10" ref={containerRef}>
      <Card
        containerRef={containerRef}
        src="https://res.cloudinary.com/du5gaixvs/image/upload/v1732008102/portfolio/WhatsApp_Image_2024-11-18_at_16.49.01_swnqcv.jpg"
        alt="Example image"
        rotate="6deg"
        top="20%"
        left="25%"
        className="w-36 md:w-56"
      />
      <Card
        containerRef={containerRef}
        src="https://img.freepik.com/free-photo/computer-scientist-designing-developing-software-applications_482257-103751.jpg?t=st=1732009403~exp=1732013003~hmac=6adbed6baa607bb09df44b22a87d06495bb03307b91ff9b702e28ae0481e759c&w=360"
        alt="Example image"
        rotate="12deg"
        top="45%"
        left="60%"
        className="w-24 md:w-48"
      />
      <Card
        containerRef={containerRef}
        src="https://img.freepik.com/free-photo/support-staff_1048-5016.jpg?t=st=1732009550~exp=1732013150~hmac=1fc3e64ef6b652cb9b53a562b73f35f79ff120b703e56e70888e8682fa9d84cc&w=740"
        alt="Example image"
        rotate="-6deg"
        top="20%"
        left="40%"
        className="w-52 md:w-80"
      />
      <Card
        containerRef={containerRef}
        src="https://img.freepik.com/free-photo/programming-background-concept_23-2150170158.jpg?t=st=1732009968~exp=1732013568~hmac=fb21f8da801f2328e29df6c7f5d385b4266e95b6952f7f161a96d7e09df2b86a&w=826"
        alt="Example image"
        rotate="8deg"
        top="50%"
        left="40%"
        className="w-48 md:w-72"
      />
      <Card
        containerRef={containerRef}
        src="https://img.freepik.com/free-photo/programming-background-collage_23-2149901770.jpg?t=st=1732010010~exp=1732013610~hmac=3ef2636b2eaf24e10a7bc147f6c002db9b91ec4656abb7ab76cfe7c50685a49b&w=826"
        alt="Example image"
        rotate="18deg"
        top="20%"
        left="65%"
        className="w-40 md:w-64"
      />
      <Card
        containerRef={containerRef}
        src="https://images.unsplash.com/photo-1622313762347-3c09fe5f2719?q=80&w=2640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Example image"
        rotate="-3deg"
        top="35%"
        left="55%"
        className="w-24 md:w-48"
      />
    </div>
  );
};

const Card = ({ containerRef, src, alt, top, left, rotate, className }:CardProps) => {
  const [zIndex, setZIndex] = useState(0);

  const updateZIndex = () => {
    const els = document.querySelectorAll(".drag-elements");

    let maxZIndex = -Infinity;

    els.forEach((el) => {
      let zIndex = parseInt(
        window.getComputedStyle(el).getPropertyValue("z-index")
      );

      if (!isNaN(zIndex) && zIndex > maxZIndex) {
        maxZIndex = zIndex;
      }
    });

    setZIndex(maxZIndex + 1);
  };

  return (
    <motion.img
      onMouseDown={updateZIndex}
      style={{
        top,
        left,
        rotate,
        zIndex,
      }}
      className={twMerge(
        "drag-elements absolute w-48 bg-neutral-200 p-1 pb-4",
        className
      )}
      src={src}
      alt={alt}
      drag
      dragConstraints={containerRef}
      // Uncomment below and remove dragElastic to remove movement after release
      //   dragMomentum={false}
      dragElastic={0.65}
    />
  );
};