import BlogsPage from '@/pages/BlogsPage';
import React from 'react';

async function getBlogs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch skills")
    }

    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching skills:", error)
    return []
  }
}

const Blogs = async() => {

    const blogs = await getBlogs();

    console.log(blogs)

    return <BlogsPage blogs={blogs}/>
};

export default Blogs;