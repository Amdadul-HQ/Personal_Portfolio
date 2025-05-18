"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import self from '../../assets/profile2.jpeg'
import { Button } from "@workspace/ui/components/button"
import Image from "next/image"

export default function AboutMe() {
     return (
          <section className="w-full min-h-screen bg-[#EFEFEF] flex items-center justify-center rounded-tl-[40px] md:rounded-tl-[80px] px-4">
               <div className="max-w-6xl mx-auto w-full  flex flex-col-reverse items-center justify-between md:flex-row gap-12 mt-4">
                    <div className="w-full md:w-1/2">
                         <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                              <Image
                                   src={self}
                                   alt="Developer portrait"
                                   className="w-full h-full object-cover object-center "
                                   loading="lazy"
                              />
                         </div>
                    </div>
                    <div className="w-full md:w-1/2 grid gap-8 ">
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                              className="space-y-2"
                         >
                              <p className="text-sm">Overview</p>
                              <p className="text-green-500">Who am I</p>
                         </motion.div>

                         <motion.h1
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="text-2xl md:text-4xl lg:text-5xl font-medium leading-tight tracking-tight lg:leading-[1.2] max-w-3xl"
                         >
                              I&apos;m a full-stack developer passionate about building innovative web applications and digital experiences
                         </motion.h1>

                         <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                              className="pt-8"
                         >
                              <Button
                                   variant="link"
                                   className="group px-4 text-green-500 rounded-full hover:border-2 border-green-500"
                                   asChild
                              >
                                   <a href="/about" className="flex items-center">
                                        Know More
                                        <motion.div
                                             whileHover={{ x: 4 }}
                                             transition={{ duration: 0.2 }}
                                             className="inline-flex items-center"
                                        >
                                             <ArrowRight className="ml-2 h-4 w-4" />
                                        </motion.div>
                                   </a>
                              </Button>
                         </motion.div>
                    </div>
               </div>
          </section>
     )
}