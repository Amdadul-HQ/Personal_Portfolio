'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { RevealLinks } from '../components/common/RevealLinks'
import { useParams } from 'next/navigation'
import MaskImage from '@/components/ui/maskImage'

export default function BlogDetails() {
  const slug  = useParams<any>()
  const [blog,setBlog] = useState<any>()
  const { scrollYProgress } = useScroll()
  
  const opacity = useTransform(scrollYProgress, [0.1, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0.1, 0.2], [1, 0.95])
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug?.slug}`)

        const data = await response.json()
        const blogData = data.data
        setBlog(blogData)

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

  if (!blog) return null

  return (
    <>
    <div className="relative bg-gradient-to-b from-orange-50 to-white min-h-screen">
      <motion.section
        style={{ opacity, scale }}
        className="relative grid min-h-[50vh] md:min-h-screen w-full place-content-center overflow-hidden px-4 py-12 md:py-0"
      >
        <h2 className="relative text-center max-w-4xl mx-auto z-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-neutral-800">
          {blog?.title}<span className="text-orange-500">.</span>
        </h2>
        <p className="mt-4 text-center text-lg sm:text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto">
          {blog?.shortDescription}
        </p>
      </motion.section>

      <MaskImage src={blog.thumbnail} />

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 py-8 md:py-16">
        <motion.div
          className="prose prose-lg max-w-none order-2 lg:order-1"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="rounded-2xl p-6 md:p-8 ">
            <p className="text-lg md:text-xl leading-relaxed text-neutral-700">{blog.description}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-1 lg:order-2"
        >
          <div className="rounded-2xl p-6 md:p-8 ">
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              <div>
                <p className="mb-2 text-orange-400 font-medium">TOPIC NAME</p>
                <p className="font-medium text-neutral-800">{blog.topic}</p>
              </div>
              <div>
                <p className="mb-2 text-orange-400 font-medium">READING TIME</p>
                <p className="font-medium text-neutral-800">{blog.readingTime}</p>
              </div>
              <div>
                <p className="mb-2 text-orange-400 font-medium">PUBLISH DATE</p>
                <p className="font-medium text-neutral-800">{new Date(blog.publishDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="mb-2 text-orange-400 font-medium">CATEGORIES</p>
                <p className="font-medium text-neutral-800">{blog.category}</p>
              </div>
            </div>

            <motion.div
              className="mt-8 flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              {blog?.brand.map((tag:string, index:number) => (
                <span
                  key={index}
                  className="rounded-full bg-gradient-to-r from-orange-500 to-orange-300 px-4 py-1.5 text-sm text-white font-medium"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <RevealLinks />
    </div>
    </>
    
  )
}