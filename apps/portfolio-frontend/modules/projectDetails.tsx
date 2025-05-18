'use client'

import React, { useEffect, useRef } from 'react'
import {  motion, useInView } from 'framer-motion'
import { useParams } from 'next/navigation'
import FuzzyOverlay from '@/components/ui/FuzzyOverlay'
import essentialharvest from '../assets/projects/eh1.png'
import sinssflow from '../assets/projects/sf.png'
import kyte from '../assets/projects/kyte1.png'
import ljs from '../assets/projects/ljs1.png'
import fi1 from '../assets/projects/fi1.png'
import qualityDigital from '../assets/projects/qd1.png'
import sp from '../assets/projects/sp.png'
import vk from '../assets/projects/vk.png'
import cp from '../assets/projects/cp.png'
import cursify from '../assets/projects/cursify.png'
import janvry from '../assets/projects/janvry.png'
import Image from 'next/image'

const projects = [
     {
          name: "JANVRY STUDIO Website",
          slug: "janvry-studio-3d-website-development",
          description: "A design and Development of the Janvry Studio website, a 3D visualization studio. The website features a modern and interactive design, showcasing the studio's projects and services.",
          features: [
               "Custom design tailored to Janvry Studio's branding",
               "Fully responsive for all devices",
               "Interactive animations and transitions",
               "Component-based frontend developed using React.js"
          ],
          techStack: ["Next Js", "Three js", "Framer Motion", "Tailwind CSS"],
          liveLink: "janvrystudionew.vercel.app",
          image: janvry,

     },
     {
          name: "Ecommerce Application",
          slug: "essential-harvest-ecommerce-application",
          description: "A robust ecommerce application developed using the MERN stack with advanced features such as inventory management, email marketing, RBAC, and third-party integrations like Razorpay for payments and Google APIs for authentication and data handling.",
          features: [
               "Manual and Google Authentication",
               "Role-Based Access Control (RBAC) for Admin and Users",
               "Inventory management system for product tracking",
               "Dashboard analysis and email marketing based on reports",
               "Third-party payment integration using Razorpay",
               "Excel data integration using Google APIs",
               "Responsive and user-friendly design"
          ],
          techStack: ["MERN (MongoDB, Express, React.js, Node.js)", "Nodemailer", "Google APIs", "Razorpay"],
          liveLink: "essentialharvest.in",
          image: essentialharvest,

     },
     {
          name: "Project Management Application",
          slug: "project-management-application-built-for-sinss",
          description: "A comprehensive project management application built for Sinss, featuring a role-based access system, Kanban boards, media storage, and resource management. Designed to streamline project workflows and track performance metrics effectively.",
          features: [
               "Role-Based Access Control (RBAC) for agencies and sub-accounts",
               "Custom dashboards for performance tracking",
               "Kanban board for task and project management",
               "Media storage system for file organization",
               "Graphical representation of funnel and metrics",
               "Resource details and invoice sending",
               "Light and dark mode toggle for accessibility"
          ],
          techStack: [
               "Next.js",
               "Prisma",
               "PostgreSQL",
               "Tailwind CSS",
               "shadcn UI",
               "Nodemailer",
               "Clerk for authentication",
               "React Query (Tanstack)"
          ],
          liveLink: "#",
          image: sinssflow,
     },
     {
          name: "Kyte Energy Website",
          slug: "kyte-energy-website-design-and-development",
          description: "The Kyte Energy website is a visually appealing and responsive platform designed to showcase the company’s offerings. The design was created in Figma and developed into a fully functional and interactive website using React.js and Framer Motion.",
          features: [
               "Custom design in Figma tailored to Kyte Energy's branding",
               "Fully responsive for all devices",
               "Smooth animations powered by Framer Motion",
               "Component-based frontend built using React.js"
          ],
          techStack: ["Figma", "React.js", "Framer Motion"],
          liveLink: "kyteenergy.com",
          image: kyte
     },
     {
          name: "LumberJack Studio Website",
          slug: "lumberjack-studio-website-design-and-development",
          description: "The LumberJack Studio website is a modern, responsive platform designed to showcase the brand’s expertise in decorative building materials. The design, created in Figma, was developed into a fully functional and visually engaging website using React.js and Framer Motion.",
          features: [
               "Custom design tailored to LumberJack Studio’s branding",
               "Fully responsive across devices",
               "Interactive animations using Framer Motion",
               "Component-based structure developed in React.js"
          ],
          techStack: ["Figma", "React.js", "Framer Motion"],
          liveLink: "lumberjackstudio.in",
          image: ljs
     },
     {
          name: "Forcon Infra Website",
          slug: "forcon-infra-website-design-and-development",
          description: "The Forcon Infra website is a sleek and professional platform designed to represent the company’s expertise in infrastructure solutions. The design was created in Figma and developed into a fully functional and responsive website using React.js and Framer Motion.",
          features: [
               "Figma design tailored to Forcon Infra’s services",
               "Fully optimized for all screen sizes",
               "Smooth animations with Framer Motion",
               "Built with React.js for scalability and performance"
          ],
          techStack: ["Figma", "React.js", "Framer Motion"],
          liveLink: "forconinfra.com",
          image: fi1
     },
     {
          name: "Quality Digital Color Lab Website",
          slug: "quality-digital-website-design-and-development",
          description: "The Quality Digital Color Lab website is a vibrant and responsive platform designed to showcase the lab’s expertise in digital printing and photography services. The design reflects the brand’s creativity and professionalism, developed using React.js and enhanced with Framer Motion.",
          features: [
               "Custom Figma design for a creative and professional feel",
               "Optimized for desktop, tablet, and mobile devices",
               "Engaging animations powered by Framer Motion",
               "Component-based development in React.js"
          ],
          techStack: ["Figma", "React.js", "Framer Motion"],
          liveLink: "qualitydigitalcolorlab.com",
          image: qualityDigital
     },
     {
          name: "Shivam Pawar Portfolio Website",
          slug: "portfolio-development",
          description: "The Shivam Pawar portfolio website is a sleek and professional platform showcasing personal projects, skills, and accomplishments. Designed in Figma, it was developed into a functional and interactive website using React.js and Framer Motion.",
          features: [
               "Custom Figma design reflecting personal branding",
               "Fully responsive for all devices",
               "Interactive animations using Framer Motion",
               "Built with React.js for performance and modularity"
          ],
          techStack: ["Figma", "React.js", "Framer Motion"],
          liveLink: "shivampawar.vercel.app",
          image: sp
     },
     {
          name: "VK Food Website",
          slug: "vk-food-website-design-and-development",
          description: "The VK Food website is a modern and visually appealing platform created to showcase the brand’s food products and services. Designed in Figma and developed using React.js, with smooth animations powered by Framer Motion.",
          features: [
               "Custom Figma design emphasizing VK Food’s branding",
               "Responsive design for all devices",
               "Smooth transitions and hover effects using Framer Motion",
               "Built with React.js for scalability and performance"
          ],
          techStack: ["Figma", "React.js", "Framer Motion"],
          liveLink: "vkfood.in",
          image: vk
     },
     {
          projectTitle: "Climate App",
          description: "A real-time weather application providing detailed climate information for locations worldwide. Built with Next.js, TanStack Query, and OpenWeather API for accurate and efficient data fetching and display.",
          features: [
               "Real-time weather updates with temperature, humidity, wind speed, and condition icons.",
               "Search functionality for finding weather details of any city.",
               "Geolocation-based weather data fetching for the user's current location.",
               "Responsive design optimized for mobile, tablet, and desktop devices.",
               "Error handling for invalid city names or API issues."
          ],
          techStack: ["Figma", "React.js", "Framer Motion", "Shadcn UI", "Tanstack"],
          liveLink: "climate-production.vercel.app/",
          image: cp
     },
     {
          name: "Cursify - Cursor Animation Library",
          slug: "cursify-cursor-animation-library",
          description: "Cursify is an open-source library designed for creating stunning and interactive cursor animations. Built with React, TypeScript, Tailwind CSS, and Framer Motion, it offers seamless integration and full customization for modern web projects.",
          features: [
               "Fully customizable cursor animations",
               "Built with modern tools like React and TypeScript",
               "Smooth motion effects powered by Framer Motion",
               "Tailwind CSS for flexible styling and design"
          ],
          techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
          liveLink: "cursify.vercel.app",
          image: cursify
     }


]

const ProjectDetails = () => {
  const {slug}  = useParams<any>()
  const project = projects.find((item) => item.slug === slug)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const statsRef = useRef(null)
  const infoRef = useRef(null)
  const descriptionRef = useRef(null)
  const imageRef = useRef(null)

  const statsInView = useInView(statsRef, { once: true })
  const infoInView = useInView(infoRef, { once: true })
  const descriptionInView = useInView(descriptionRef, { once: true })
  const imageInView = useInView(imageRef, { once: true })

  return (
    <>
    {/* <SEO
        title={project.name}
        description={project.name}
        path={`/projects/${project.slug}`}
      /> */}
    <div className="bg-gray-50">
      <div className="relative overflow-hidden rounded-b-[80px]">
        <section className="relative grid h-[70vh] w-full place-content-center overflow-hidden bg-[#fff]">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-center z-0 text-[10vw] font-black text-neutral-800 md:text-[60px]"
          >
            {project?.name}<span className="text-orange-500">.</span>
          </motion.h2>
        </section>
        <FuzzyOverlay />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div 
          ref={statsRef}
          initial={{ opacity: 0, y: 50 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {[
            { value: "5520", label: "Elements created" },
            { value: "4688", label: "Lines of code" },
            { value: "TBA", label: "Awards & Mentions" },
            { value: "35", label: "Total Project Days" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <h3 className="text-2xl font-bold text-orange-500">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="flex flex-col md:flex-row gap-16">
          <motion.div 
            ref={infoRef}
            initial={{ opacity: 0, x: -50 }}
            animate={infoInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="md:w-1/3"
          >
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4">Project Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">BRAND</h4>
                  <p>{project?.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold">TYPE</h4>
                  <p>Website</p>
                </div>
                <div>
                  <h4 className="font-semibold">TECHNOLOGY</h4>
                  <ul className='flex flex-wrap gap-2'>
                    {project?.techStack.map((tech, index) => (
                      <li className='bg-green-200 p-1 rounded-lg px-2 ' key={index}>{tech}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Services</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Web Design</li>
                <li>Web Development</li>
                <li>Animations</li>
                <li>Branding</li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            ref={descriptionRef}
            initial={{ opacity: 0, x: 50 }}
            animate={descriptionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="md:w-2/3"
          >
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Project Description</h2>
              <p className="text-gray-700 leading-relaxed">{project?.description}</p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Features</h2>
              <ul className="list-disc list-inside space-y-2">
                {project?.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Links</h2>
              <a 
                href={`https://${project.liveLink}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
              >
                Visit Website
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          ref={imageRef}
          initial={{ opacity: 0, y: 50 }}
          animate={imageInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <Image
            src={project?.image}
            alt={project?.name || 'Project Mockup'}
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </motion.div>
      </div>
    </div>
    </>
  )
}

export default ProjectDetails