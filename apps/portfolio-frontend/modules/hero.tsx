'use client'

import { FlipWords } from '@/components/ui/flip-wors'
import { motion, useScroll, useTransform } from 'framer-motion'


const Hero =() => {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])
  const y = useTransform(scrollY, [0, 200], [0, 100])
  const words = ["creative", "interactive", "beautiful", "modern"]

  return (
    <div className="relative min-h-[90vh] flex items-center">
        <motion.div
          style={{ opacity, y }}
          className="container relative z-10 mx-auto px-4 py-24 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4 flex flex-col justify-center items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-fit mx-auto px-4 py-1.5 rounded-full bg-green-300/50 text-primary text-sm font-medium"
                >
                  🎉 | Available for work
                </motion.div>


                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold  text-primary sm:text-5xl lg:text-6xl "
                >
                  Hi, I&apos;m Amdadul HQ<span className="text-green-300">.</span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl sm:text-3xl lg:text-4xl text-black font-medium"
                >
                  I build{' '}
                  <FlipWords
                    duration={3000}
                    className="bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-2 rounded-xl shadow-lg"
                    words={words}
                  />{' '}
                  <span className="block sm:inline text-black">websites</span>
                </motion.div>

              </div>
            </motion.div>
          </div>
        </motion.div>
      {/* </ImageMouseTrail> */}

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />

      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-gray-950 dark:[background:radial-gradient(#1a1a1a_1px,transparent_1px)]" />
    </div>
  )
}

export default Hero