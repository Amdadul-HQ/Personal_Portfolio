'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { RevealLinks } from '../components/common/RevealLinks'
import { useParams } from 'next/navigation'
import MaskImage from '@/components/ui/maskImage'

const blogData = [
  {
    slug: "exploring-nvidia-llama-3-1",
    title: "Exploring NVIDIA's Llama-3.1-Nemotron-70B-Instruct: A Frontier in Text Generation AI",
    author: "Durgesh Bachhav",
    date: "2024-11-15",
    readingTime: "5 min",
    topic: "AI + MACHINE LEARNING",
    image: "https://images.unsplash.com/photo-1625314868143-20e93ce3ff33?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: "In a revolutionary leap forward for AI technology, NVIDIA's Llama-3.1-Nemotron-70B-Instruct represents a quantum leap in language model capabilities...",
    publishDate: "15 nov, 2024",
    metaTitle: "NVIDIA's Llama-3.1: Revolutionizing AI Language Models",
    metaDescription: "Discover NVIDIA's groundbreaking Llama-3.1-Nemotron-70B-Instruct model...",
    summary: "An in-depth exploration of NVIDIA's latest breakthrough in AI language models...",
    tags: ["NVIDIA", "Llama-3.1", "Natural Language Processing", "AI Models"],
    categories: ["Technology", "AI"]
  },
  {
    slug: "quantum-machine-learning-new-era",
    title: "The Rise of Quantum Machine Learning: A New Era in AI",
    author: "Durgesh Bachhav",
    date: "2024-11-12",
    readingTime: "7 min",
    topic: "QUANTUM COMPUTING",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: "Quantum Machine Learning (QML) is ushering in a transformative era at the convergence of quantum physics and artificial intelligence...",
    publishDate: "12 nov, 2024",
    metaTitle: "Quantum Machine Learning: Revolutionizing AI Computing",
    metaDescription: "Explore how Quantum Machine Learning is transforming AI capabilities...",
    summary: "A comprehensive analysis of how Quantum Machine Learning is revolutionizing computational capabilities...",
    tags: ["Quantum Computing", "Machine Learning", "AI Innovation", "Quantum Algorithms"],
    categories: ["Technology", "AI"]
  },
  {
    slug: "rust-web-development",
    title: "Rust for Web Development: Performance Meets Safety",
    author: "Durgesh Bachhav",
    date: "2024-11-09",
    readingTime: "6 min",
    topic: "WEB DEVELOPMENT",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: "Rust is revolutionizing web development by introducing unprecedented levels of performance and safety to the server-side ecosystem...",
    publishDate: "09 nov, 2024",
    metaTitle: "Rust Web Development: The Future of High-Performance Web Applications",
    metaDescription: "Discover how Rust is transforming web development with unmatched performance...",
    summary: "An extensive exploration of Rust's impact on modern web development...",
    tags: ["Rust", "Web Development", "Performance", "Systems Programming"],
    categories: ["Technology", "Programming"]
  },
  {
    slug: "edge-computing-revolution",
    title: "The Edge Computing Revolution: Bringing AI to IoT Devices",
    author: "Durgesh Bachhav",
    date: "2024-11-06",
    readingTime: "5 min",
    topic: "IOT + EDGE COMPUTING",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: "Edge computing is fundamentally reshaping the IoT landscape through groundbreaking innovations in distributed AI processing...",
    publishDate: "06 nov, 2024",
    metaTitle: "Edge Computing: Transforming IoT with Advanced AI Integration",
    metaDescription: "Learn how edge computing is revolutionizing IoT devices through AI integration...",
    summary: "A deep dive into how edge computing is transforming IoT through advanced AI integration...",
    tags: ["Edge Computing", "IoT", "AI", "Distributed Systems"],
    categories: ["Technology", "Innovation"]
  },
  {
    slug: "graphql-api-design",
    title: "Best Practices for GraphQL API Design",
    author: "Durgesh Bachhav",
    date: "2024-11-03",
    readingTime: "8 min",
    topic: "API DEVELOPMENT",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: "GraphQL API design has evolved significantly, with new patterns emerging that optimize performance and developer experience...",
    publishDate: "03 nov, 2024",
    metaTitle: "Advanced GraphQL API Design: Modern Patterns and Practices",
    metaDescription: "Master GraphQL API design with cutting-edge best practices...",
    summary: "An expert guide on GraphQL API design, featuring advanced schema structuring, performance techniques...",
    tags: ["GraphQL", "API Design", "Web Development", "Best Practices"],
    categories: ["Technology", "Programming"]
  }
];


export default function BlogDetails() {
  const slug  = useParams<any>()
  const [blog, setBlog] = useState<{title:string,summary:string,image:string,topic:string,content:string,readingTime:string,date?:string,publishDate:string,categories:string[],tags:string[]|null}>(null)

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0.1, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0.1, 0.2], [1, 0.95])
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const currentBlogIndex = blogData?.findIndex(blog => blog.slug === slug.slug)
    if (currentBlogIndex !== -1) {
      setBlog(blogData[currentBlogIndex])
    }
  }, [slug])

  if (!blog) return null

  return (
    <>
     {/* <SEO
        title={blog.metaTitle}
        description={blog.metaDescription}
        path={`/blogs/${blog.slug}`}
      /> */}
    <div className="relative bg-gradient-to-b from-orange-50 to-white min-h-screen">
      <motion.section
        style={{ opacity, scale }}
        className="relative grid min-h-[50vh] md:min-h-screen w-full place-content-center overflow-hidden px-4 py-12 md:py-0"
      >
        <h2 className="relative text-center max-w-4xl mx-auto z-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-neutral-800">
          {blog?.title}<span className="text-orange-500">.</span>
        </h2>
        <p className="mt-4 text-center text-lg sm:text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto">
          {blog?.summary}
        </p>
      </motion.section>

      <MaskImage src={blog.image} />

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 py-8 md:py-16">
        <motion.div
          className="prose prose-lg max-w-none order-2 lg:order-1"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="rounded-2xl p-6 md:p-8 ">
            <p className="text-lg md:text-xl leading-relaxed text-neutral-700">{blog.content}</p>
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
                <p className="font-medium text-neutral-800">{blog.publishDate || blog.date}</p>
              </div>
              <div>
                <p className="mb-2 text-orange-400 font-medium">CATEGORIES</p>
                {blog.categories.map((item, index) => (
                  <p key={index} className="font-medium text-neutral-800">{item}</p>
                ))}
              </div>
            </div>

            <motion.div
              className="mt-8 flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              {blog.tags.map((tag, index) => (
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

      {/* <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex  sm:flex-row justify-between items-center gap-4">
        {prevBlog && (
          <Link
            to={`/blogs/${prevBlog.slug}`}
            className="flex w-full sm:w-auto items-center justify-center sm:justify-start px-6 py-3 bg-orange-100 hover:bg-orange-200 rounded-full text-orange-600 hover:text-orange-700 transition-colors duration-300 ease-in-out"
          >
            <ChevronLeft className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="truncate">Previous</span>
          </Link>
        )}
        {nextBlog && (
          <Link
            to={`/blogs/${nextBlog.slug}`}
            className="flex w-full sm:w-auto items-center justify-center sm:justify-end px-6 py-3 bg-orange-100 hover:bg-orange-200 rounded-full text-orange-600 hover:text-orange-700 transition-colors duration-300 ease-in-out"
          >
            <span className="truncate">Next</span>
            <ChevronRight className="w-5 h-5 ml-2 flex-shrink-0" />
          </Link>
        )}
      </div> */}

      <RevealLinks />
    </div>
    </>
    
  )
}