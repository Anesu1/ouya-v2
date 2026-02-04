"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function HeroCarousel({
  slides,
}: { slides: { id: string; title: string; description: string; image?: string; link: string }[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const nextSlide = useCallback(() => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % slides.length)

    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }, [isTransitioning])

  const prevSlide = useCallback(() => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }, [isTransitioning])

  useEffect(() => {
    resetTimeout()
    timeoutRef.current = setTimeout(() => {
      nextSlide()
    }, 6000)

    return () => {
      resetTimeout()
    }
  }, [currentSlide, nextSlide, resetTimeout])

  return (
    <section className="relative h-[85vh] md:h-[660px] lg:h-[90vh] overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative h-full w-full">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover opacity-70"
              priority={index === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 flex items-end justify-end pb-[15%] lg:pb-[5%]">
              <div className="text-center text-white px-4 max-w-4xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">{slide.title}</h2>
                <p className="text-xl md:text-2xl mb-10 tracking-wide font-light">{slide.description}</p>
                <Link href={`/collections/${slide.link}`} className="inline-block">
                  <span className="mt-auto border border-white  text-sm  tracking-wider uppercase  hover:text-black  inline-block px-6 py-3 bg-white text-black font-semibold rounded-md shadow-lg hover:bg-gray-100 transition-colors">
                    Shop Now
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black transition-all text-white z-10"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black transition-all text-white z-10"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-1 transition-all ${index === currentSlide ? "w-8 bg-white" : "w-3 bg-white/50"}`}
            onClick={() => {
              setCurrentSlide(index)
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
