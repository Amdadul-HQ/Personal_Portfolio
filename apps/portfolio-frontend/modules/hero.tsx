'use client'

import { FlipWords } from '@/components/ui/flip-wors'
import { motion, useScroll, useTransform } from 'framer-motion'
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import HeroTechBeams from '@/components/common/heroTechBeams'
import { AnimatedBeam } from '@/components/magicui/animated-beam'
import Link from 'next/link'
import { createRef, useEffect, useRef, useState } from 'react'
import { FaLaptopCode, FaServer, FaDatabase, FaCloud, FaFigma } from 'react-icons/fa'

const expertise = [
  { label: 'Frontend', Icon: FaLaptopCode },
  { label: 'Backend', Icon: FaServer },
  { label: 'Database', Icon: FaDatabase },
  { label: 'DevOps', Icon: FaCloud },
  { label: 'UI/UX Design', Icon: FaFigma },
]

const Hero = () => {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])
  const y = useTransform(scrollY, [0, 200], [0, 100])
  const words = ["creative", "interactive", "beautiful", "modern"]

  // Refs for the profile -> expertise-badge beams
  const beamContainerRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const badgeRefs = useRef(expertise.map(() => createRef<HTMLDivElement>()))

  // Resume link — set from the admin dashboard's Site Settings page
  const [resumeLink, setResumeLink] = useState('')
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`)
        const data = await response.json()
        setResumeLink(data?.data?.resumeLink || '')
      } catch (error) {
        console.error('Error fetching site settings:', error)
      }
    }
    fetchSettings()
  }, [])

  return (
    <div className="relative min-h-screen justify-center flex flex-col items-center" data-pet-section="home">
        <motion.div
          style={{ opacity, y }}
          className="container relative z-10 mx-auto px-4 py-24 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Relative wrapper so the beams can span from the profile to the badges */}
              <div ref={beamContainerRef} className="relative">
                {/* Foreground content */}
                <div className="relative z-10 space-y-6">
                  <HeroTechBeams centerRef={profileRef} />

                  <div className="space-y-5 flex flex-col justify-center items-center">
                    {/* Available for work */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-fit mx-auto px-4 py-1.5 rounded-full bg-green-300/50 text-primary text-sm font-medium dark:bg-green-500/20 dark:text-green-300"
                    >
                      🎉 | Available for work
                    </motion.div>

                    {/* Expertise badges — the 5 beams from the profile connect here */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-wrap items-center justify-center gap-3 max-w-2xl"
                    >
                      {expertise.map((item, i) => (
                        <div
                          key={item.label}
                          ref={badgeRefs.current[i]}
                          className="inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/5 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur-sm transition-colors hover:border-green-500/70 hover:bg-green-500/10 dark:shadow-none"
                        >
                          <item.Icon className="text-green-500" />
                          {item.label}
                        </div>
                      ))}
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl font-bold text-primary sm:text-5xl lg:text-6xl"
                    >
                      Hi, I&apos;m Amdadul HQ.
                    </motion.h1>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl sm:text-3xl lg:text-4xl text-black dark:text-white font-medium"
                    >
                      I build{' '}
                      <FlipWords
                        duration={3000}
                        className="bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-2 rounded-xl shadow-lg dark:shadow-[0_8px_30px_-15px_rgba(34,197,94,0.35)]"
                        words={words}
                      />{' '}
                      <span className="block sm:inline text-black dark:text-white">websites</span>
                    </motion.div>

                    {/* Role line */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      className="text-lg sm:text-xl font-semibold text-primary"
                    >
                      Full-Stack Developer <span className="text-green-500">&amp;</span> Figma Designer
                    </motion.p>
                  </div>
                </div>

                {/* Beams: from the profile image down into each expertise badge */}
                <div className="pointer-events-none absolute inset-0 z-0">
                  {badgeRefs.current.map((ref, i) => (
                    <AnimatedBeam
                      key={i}
                      containerRef={beamContainerRef}
                      fromRef={profileRef}
                      toRef={ref}
                      duration={3.5}
                      delay={i * 0.3}
                      pathWidth={2.5}
                      pathOpacity={0.2}
                      pathColor="#22c55e"
                      gradientStartColor="#16a34a"
                      gradientStopColor="#4ade80"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          <div className='flex items-center gap-x-3 mt-6 justify-center'>
          {resumeLink ? (
            <Link href={resumeLink} target='_blank' rel='noopener noreferrer'>
              <ShimmerButton>
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                Resume
                </span>
              </ShimmerButton>
            </Link>
          ) : null}
          <Link href='/contact'>
          <InteractiveHoverButton>Hire Me</InteractiveHoverButton>
          </Link>
          </div>
        </motion.div>
    </div>
  )
}

export default Hero
