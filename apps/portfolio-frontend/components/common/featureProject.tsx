"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { ArrowRight, MoveRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import essentialharvest from '../../assets/projects/eh1.png'
import janvry from '../../assets/projects/janvry.png'
import cursify from '../../assets/projects/cursify.png'
import Link from 'next/link'

type ImageType = {
  id?: number;
  src: object; // If using static imports like in your case, `StaticImageData` is more accurate
  alt?: string;
  description?: string;
  slug?: string;
}


const images :ImageType[]  = [
     {
          id: 1,
          src: janvry,
          alt: 'Janvry Studio',
          description: 'Janvry Studio 3d website Development',
          slug: "janvry-studio-3d-website-development"
     },
     {
          id: 2,
          src: cursify,
          alt: 'Cursify - Cursor animation Library',
          description: 'Cursify - Cursor animation Library',
          slug: "cursify-cursor-animation-library"
     },
     {
          id: 3,
          src: essentialharvest,
          alt: 'Essential Harvest',
          description: 'Full-stack E-commerce Application',
          slug: "essential-harvest-ecommerce-application"
     },
]

type APIResponse<T> = {
  data: T;
  message?: string;
  success?: boolean;
}

type ProjectType = {
  id: string;
  name: string;
  description: string;
  siteMockup: string; // assuming it's a string URL
};

export default function Projects() {
     const [activeImage, setActiveImage] = useState<string | null>(null);
     const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
     const requestRef = useRef<number | null>(null)
     const prevCursorPosition = useRef({ x: 0, y: 0 })
     const [featureProjects, setFeaturedProjects] = useState<ProjectType[]>([])

     const handleMouseMove = useCallback((e:any) => {
          const { clientX, clientY } = e
          const dx = clientX - prevCursorPosition.current.x
          const dy = clientY - prevCursorPosition.current.y
          const easeAmount = 0.15
          const newX = prevCursorPosition.current.x + dx * easeAmount
          const newY = prevCursorPosition.current.y + dy * easeAmount
          setCursorPosition({ x: newX, y: newY })
          prevCursorPosition.current = { x: newX, y: newY }
     }, [])

useEffect(() => {
  async function fetchBlog() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects?isFeatured=true`);
      const data = await response.json();
      const featuredProjectsData: ProjectType[] = data.data; // Type here
      setFeaturedProjects(featuredProjectsData);
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  }
  fetchBlog();
}, []);

     useEffect(() => {
          const updateCursorPosition = (e:any) => {
               if (requestRef.current) return
               requestRef.current = requestAnimationFrame(() => {
                    handleMouseMove(e)
                    requestRef.current = null
               })
          }
          window.addEventListener('mousemove', updateCursorPosition)
          return () => {
               window.removeEventListener('mousemove', updateCursorPosition)
               if (requestRef.current) cancelAnimationFrame(requestRef.current)
          }
     }, [handleMouseMove])

     const handleImageHover = useCallback((image:any) => setActiveImage(image), [])

     const handleMouseLeave = useCallback(() => {
          setActiveImage(null)
     }, [])

     return (
          <div className="w-full min-h-screen bg-[#161719] text-white px-4 py-24 rounded-tr-[80px]">
               <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.5 }}
                         className="mb-10 flex items-center justify-between w-full"
                    >
                         <div className=''>
                              <h2 className="text-green-500 text-4xl font-bold">FEATURED PROJECTS</h2>
                              <p className="text-gray-400 text-lg">Selected Works</p>
                         </div>
                         <Link className='flex gap-2 hover:border-b border-green-400 hover:text-green-400' href='/projects'>
                              See All Projects
                              <motion.div
                                   whileHover={{ x: 5 }}
                                   transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                   <MoveRight />
                              </motion.div>
                         </Link>
                    </motion.div>

                    <div
                         className="space-y-8 w-full h-full relative"
                         onMouseLeave={handleMouseLeave}
                    >
                         {featureProjects.map((image, index) => (
                              <motion.div
                                   key={image.id}
                                   className="cursor-pointer flex flex-col md:flex-row items-start justify-between gap-4 group"
                                   onMouseEnter={() => handleImageHover(image?.siteMockup)}
                                   initial={{ opacity: 0, y: 30 }}
                                   whileInView={{ opacity: 1, y: 0 }}
                                   transition={{ duration: 0.5, delay: index * 0.2 }}
                                   whileHover={{ scale: 1.02 }}
                              >
                                   <div className="space-y-2 min-w-80">
                                        <span className="text-sm text-gray-500">0{index + 1}</span>
                                        <h3 className="text-sm font-medium">{image.name}</h3>
                                   </div>
                                   <div className="flex items-center justify-between w-full border-b pb-4 group-hover:border-green-500 transition-colors duration-300">
                                        <h2 className="text-xl md:text-3xl lg:text-3xl font-light group-hover:text-green-500 transition-colors duration-300">
                                             {image.description}
                                        </h2>
                                        <Link
                                             href={`/projects/${image.id}`}
                                             className="inline-flex items-center text-green-500 hover:text-green-400 transition-colors"
                                            //  whileHover={{ x: 5 }}
                                            // onMouseOver={{x:5}}
                                            //  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                             <span className=''>View Project</span> <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                   </div>
                              </motion.div>
                         ))}
                    </div>
               </div>
               <AnimatePresence>
                    {activeImage && (
                         <motion.img
                              key={activeImage}
                              src={activeImage}
                              alt={activeImage}
                              className="fixed border-4 border-green-200  object-cover pointer-events-none z-10 w-96 rounded-lg shadow-lg"
                              style={{
                                   left: `${cursorPosition.x}px`,
                                   top: `${cursorPosition.y}px`,
                                   transform: 'translate(-50%, -50%)'
                              }}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                         />
                    )}
               </AnimatePresence>
          </div>
     )
}