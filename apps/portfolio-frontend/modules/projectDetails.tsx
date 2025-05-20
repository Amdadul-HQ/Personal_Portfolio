'use client'

import React, { useEffect, useRef, useState } from 'react'
import {  motion, useInView } from 'framer-motion'
import { useParams } from 'next/navigation'
import FuzzyOverlay from '@/components/ui/FuzzyOverlay'
import Image from 'next/image'
import { intervalToDuration, isValid, parseISO } from 'date-fns'

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR'; // Adjust based on your roles
  password: string;
}

export interface IProject {
  id: string;
  name: string;
  description: string;
  siteMockup: string;
  techonology: string[]; // Typo preserved if API returns it this way
  features: string[];
  services: string[];
  elements: number;
  totalCode: number;
  gitHubLink: string;
  liveLink: string;
  type: string;
  isFeatured: boolean;
  projectStartDate: string; // ISO date string
  projectEndDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: IUser;
}

const getProjectDuration = (start?: string, end?: string) => {
  if (!start || !end) {
    return { summary: "Invalid date", totalYears: 0, totalMonths: 0, totalDays: 0 }
  }

  const startDate = parseISO(start)
  const endDate = parseISO(end)

  if (!isValid(startDate) || !isValid(endDate)) {
    return { summary: "Invalid date", totalYears: 0, totalMonths: 0, totalDays: 0 }
  }

  const duration = intervalToDuration({ start: startDate, end: endDate })

  const parts = []
  if (duration.years) parts.push(`${duration.years} year${duration.years > 1 ? 's' : ''}`)
  if (duration.months) parts.push(`${duration.months} month${duration.months > 1 ? 's' : ''}`)
  if (duration.days) parts.push(`${duration.days} day${duration.days > 1 ? 's' : ''}`)

  const summary = parts.length > 0 ? parts.join(", ") : "0 day"

  return {
    totalYears: duration.years,
    totalMonths: duration.months,
    totalDays: duration.days,
    summary,
  }
}


const ProjectDetails = () => {
  const slug  = useParams<any>()
  const [project,setProject] = useState<IProject>()
  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${slug?.slug}`)

        const data = await response.json()
        const projectData = data.data
        setProject(projectData)

      } catch (error) {
        console.error("Error fetching blog:", error)
        // toast({
        //   title: "Error",
        //   description: "Failed to fetch blog data. Please try again.",
        //   variant: "destructive",
        // })
      } 
    }

    fetchBlog()
  }, [slug?.slug])
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
  console.log(project)
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
            { value: project?.elements, label: "Elements created" },
            { value: project?.totalCode, label: "Lines of code" },
            { value: "TBA", label: "Awards & Mentions" },
            { value: `${getProjectDuration(project?.projectStartDate,project?.projectEndDate).summary}`, label: "Total Project Days" }
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
                  <p>{project?.type}</p>
                </div>
                <div>
                  <h4 className="font-semibold">TECHNOLOGY</h4>
                  <ul className='flex flex-wrap gap-2'>
                    {project?.techonology.map((tech, index) => (
                      <li className='bg-green-200 p-1 rounded-lg px-2 ' key={index}>{tech}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Services</h3>
              <ul className="list-disc list-inside space-y-2">
                {
                  project?.services.map((service,index) =><li key={index}>{service}</li>)
                }
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
                href={`https://${project?.liveLink}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
              >
                Visit Website
              </a>
              <a 
                href={`https://${project?.gitHubLink}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
              >
                View Code
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
            src={project?.siteMockup || "/fallback.png"}
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