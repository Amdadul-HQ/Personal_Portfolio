import React from "react";
import { motion } from "framer-motion";
import noiseImage from '../../assets/black-noise.png'

const FuzzyOverlay = () => {
  return (
    <motion.div
      initial={{ transform: "translateX(-10%) translateY(-10%)" }}
      animate={{
        transform: "translateX(10%) translateY(10%)",
      }}
      transition={{
        repeat: Infinity,
        duration: 0.2,
        ease: "linear",
        repeatType: "mirror",
      }}
      style={{
        backgroundImage: `url(${noiseImage})`,
      }}
      className="pointer-events-none absolute -inset-[100%] opacity-[15%] "
    />
  );
};

export default FuzzyOverlay;