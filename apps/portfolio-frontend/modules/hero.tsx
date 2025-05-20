'use client'

import { FlipWords } from '@/components/ui/flip-wors'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import profile from '../assets/portfolio.jpeg'
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import Link from 'next/link'
const Hero =() => {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])
  const y = useTransform(scrollY, [0, 200], [0, 100])
  const words = ["creative", "interactive", "beautiful", "modern"]

  return (
    <div className="relative min-h-screen justify-center flex flex-col items-center">
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
              <ShimmerButton shimmerColor='#BCF8D3' shimmerSize='6px' shimmerDuration='1s' className='p-[1px] mx-auto'> 
                <div className='w-[200px] h-[200px] relative overflow-hidden rounded-full mx-auto'>
                <Image
                src={profile}
                className='w-full absolute -top-12'
                alt='Amdadul Image'
                />
              </div>
              </ShimmerButton>
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
                  Hi, I&apos;m Amdadul HQ.
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
          <div className='flex items-center gap-x-3 mt-3 justify-center'>
          <Link href="https://drive.google.com/file/d/11s-a26rikQlVfEZs64oLOAEmC2yyxdc6/view?usp=sharing" target='_blnk'>
          <ShimmerButton> 
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
            Resume
            </span>
          </ShimmerButton>
          </Link>
          <Link href='/contact'>
          <InteractiveHoverButton>Hire Me</InteractiveHoverButton>
          </Link>
          </div>
        </motion.div>
    </div>
  )
}

export default Hero