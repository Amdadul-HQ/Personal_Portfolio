"use client"

import React from 'react';
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import ScrollElement from '@/components/ui/scroll-element';
import { RevealLinks } from '@/components/common/RevealLinks';


const BlogsPage = ({blogs}:any) => {
     // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

    return (
        <>
         <section className="relative grid min-h-screen w-full place-content-center overflow-hidden ">
            <h2 className="relative z-0 text-[14vw] font-black text-neutral-800 md:text-[200px]">
            BLOGS<span className="text-orange-500">.</span>
            </h2>
      </section>   
            <motion.div
          className="grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto lg:grid-cols-4 gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogs?.map((blog:any) => (
            <motion.div
              key={blog.id}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <motion.div
                className="relative h-48 w-full overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image src={blog?.thumbnail || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
              </motion.div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{blog.shortDescription}</p>
                <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="inline-flex items-center text-green-500 font-medium hover:text-green-600 transition-colors"
                  >
                    Read More
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        ease: "easeInOut",
                        repeatDelay: 1,
                      }}
                    >
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </motion.span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <ScrollElement className='mt-10'>
            <RevealLinks />
        </ScrollElement>
        </>
    );
};

export default BlogsPage;