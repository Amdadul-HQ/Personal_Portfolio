'use client'
import LocomotiveScroll from 'locomotive-scroll';
import { Asterisk, Menu, Github } from 'lucide-react'
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@workspace/ui/components/sheet"
import { useEffect, useState } from 'react';


const navLinks = [
  { id: "01", name: "Home", href: "/" },
  { id: "02", name: "Projects", href: "/projects" },
  { id: "03", name: "Blogs", href: "/blogs" },
  { id: "04", name: "About", href: "/about" },
  { id: "06", name: "Contact", href: "/contact" },
]
const Navbar =() => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDeepScrolled, setIsDeepScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // useEffect(() => {
  //   const scroll = new LocomotiveScroll({
  //     el: document.querySelector("[data-scroll-container]"),
  //     smooth: true,
  //   });

  //   return () => scroll.destroy(); 
  // }, []);
  // const [activeSection, setActiveSection] = useState('');

  const playClickSound = () => {
    const audio = new Audio('/src/assets/sfx/click.wav')
    audio.play()
  }

   useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200)
      console.log(window.scrollY)
      setIsDeepScrolled(window.scrollY > 1500 && window.scrollY < 3840)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Text color class based on scroll position
  const textColorClass = isDeepScrolled ? "text-green-400" : ""



  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? "backdrop-blur-md" : "bg-transparent"}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 rounded-lg">
          <div className="flex items-center">
            <Link href={"/"}>
              <div>
                <p className={`font-bold ${textColorClass}`}>Amdadul-HQ</p>
                {/* <Image
                width={100}
                 src={logo || "/placeholder.svg"}
                 alt="Logo"
                /> */}
              </div>
            </Link>

            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navLinks.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`text-sm transition-all duration-300 font-medium ${textColorClass}`}
                      onClick={playClickSound}
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Link target="_blank" href={"https://github.com/Amdadul-HQ"}>
              <Button
                variant="ghost"
                size="icon"
                className={`mr-2 bg-green-400 cursor-pointer`}
              >
                <Github className="h-5 w-5" />
              </Button>
            </Link>
            <div className='md:hidden flex'>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[300px] bg-green-300 backdrop-blur-lg">
                <SheetHeader className="border-b border-green-900 pb-4">
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => {
                        setIsOpen(false)
                        playClickSound()
                      }}
                    >
                      <div className="flex items-center space-x-4 px-2 py-2 hover:bg-white active:bg-white rounded-md transition-colors border-b border-slate-900">
                        <span className="text-sm text-gray-800">{item.id}</span>
                        <span className="text-base font-bold">{item.name}</span>
                      </div>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}


export default Navbar