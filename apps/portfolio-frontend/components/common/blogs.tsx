"use client"

import Image from "next/image"
import { ArrowRight, MoveRight } from "lucide-react"
import { motion } from "framer-motion"
import essentialharvest from '../../assets/projects/eh1.png'
import janvry from '../../assets/projects/janvry.png'
import cursify from '../../assets/projects/cursify.png'
import Link from "next/link"
import { useEffect, useState } from "react"

// Sample blog data - replace with your actual data source
const popularBlogs = [
  {
    id: 1,
    title: "10 Essential Web Development Tools for 2025",
    slug: "essential-web-dev-tools-2025",
    thumbnail: essentialharvest,
    excerpt: "Discover the must-have tools that will revolutionize your web development workflow this year.",
  },
  {
    id: 2,
    title: "How to Build Responsive Layouts with Tailwind CSS",
    slug: janvry,
    thumbnail: janvry,
    excerpt: "Learn the techniques for creating beautiful, responsive designs using Tailwind CSS.",
  },
  {
    id: 3,
    title: "Getting Started with Framer Motion Animations",
    slug: "framer-motion-animations-guide",
    thumbnail: cursify,
    excerpt: "A comprehensive guide to creating stunning animations with Framer Motion in React.",
  },
  {
    id: 4,
    title: "The Future of React: What's Coming in 2025",
    slug: "future-of-react-2025",
    thumbnail: essentialharvest,
    excerpt: "Explore the upcoming features and changes in React that will shape frontend development.",
  },
]

export function PopularBlogs() {
  const [blogs,setBlogs] = useState([])
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

  useEffect(()=>{
    async function fetchBlog() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs?isFeatured=true`)

        const data = await response.json()
        const blogData = data.data
        setBlogs(blogData)
      } catch (error) {
        console.error("Error fetching blog:", error)
      } 
    }
    fetchBlog()
  },[])



  return (
    <section className="w-full min-h-screen bg-[#EFEFEF] flex py-24 justify-center rounded-tr-[40px] md:rounded-tr-[80px] rounded-tl-[40px] md:rounded-tl-[80px] px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          className="mb-12 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Most Popular</h2>
          <motion.p
            className="mt-4 text-gray-600 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Our most read articles and resources that readers love
          </motion.p>
          </div>
          <Link className='flex gap-2 hover:text-green-400' href='/blogs'>
        See All Blogs
        <motion.div
             whileHover={{ x: 5 }}
             transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
             <MoveRight />
        </motion.div>
        </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2"
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
      </div>
    </section>
  )
}
