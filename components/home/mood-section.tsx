"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function MoodSection({ content }: { content: any }) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  })

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  }

  return (
    <section
      ref={ref}
      className={`relative py-20 border-b border-gray-100 text-white overflow-hidden ${
        content?.perfectScent?.image ? `bg-cover bg-no-repeat bg-center` : "bg-black"
      }`}
      style={content?.perfectScent?.image ? { backgroundImage: `url('${content?.perfectScent?.image}')` } : undefined}
    >
      {content?.perfectScent?.image && <div className="absolute inset-0 bg-black/70 z-0" />}
      <motion.div
        className="text-center max-w-3xl mx-auto px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.h2 className="text-4xl md:text-5xl font-light mb-8 tracking-tight" variants={itemVariants}>
          {content?.perfectScent?.heading || "Find Your Perfect Scent"}
        </motion.h2>
        <motion.p className="text-lg text-gray-300 mb-10 tracking-wide" variants={itemVariants}>
          {content?.perfectScent?.description || "Discover candles that match your mood and transform your space"}
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link href="/collections/all">
            <motion.span
              className="inline-block bg-white text-black px-12 py-4 text-sm font-medium tracking-wider uppercase hover:bg-gray-200 transition-colors cursor-hover"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Explore Collection
            </motion.span>
          </Link>
        </motion.div>

        <motion.div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6" variants={containerVariants}>
          {content?.perfectScent?.scents.map((mood, index) => (
            <motion.a
              Link
              href={`/collections/${mood?.link}`}
              key={index}
              className="aspect-square flex items-center justify-center bg-charcoal-light hover:bg-gold-dark transition-colors duration-300 cursor-hover"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              {" "}
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-lg font-light tracking-wider">{mood?.name}</span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
