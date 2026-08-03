'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 'men',
    title: "Men's Collection",
    subtitle: 'Step Into Greatness',
    description: 'Engineered for performance and style. Discover shoes built for every stride.',
    cta: 'Shop Men',
    href: '/products?gender=men',
    image: '/images/hero/mens-collection.png',
    bgGradient: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
    accentColor: '#D4A853',
  },
  {
    id: 'women',
    title: "Women's Collection",
    subtitle: 'Elegance in Motion',
    description: 'From runway to everyday. Shoes that empower your every move.',
    cta: 'Shop Women',
    href: '/products?gender=women',
    image: '/images/hero/womens-collection.png',
    bgGradient: 'from-[#2d1f3d] via-[#44275c] to-[#4a1942]',
    accentColor: '#e8c4c4',
  },
  {
    id: 'kids',
    title: "Children's Collection",
    subtitle: 'Little Feet, Big Adventures',
    description: 'Durable, fun, and comfortable shoes for your little explorers.',
    cta: 'Shop Kids',
    href: '/products?gender=kids',
    image: '/images/hero/kids-collection.png',
    bgGradient: 'from-[#1a3c5e] via-[#1e5f8c] to-[#2080b0]',
    accentColor: '#f0c040',
  },
  {
    id: 'new',
    title: 'New Arrivals',
    subtitle: 'Fresh Drops Weekly',
    description: 'Be the first to rock the latest styles. Limited editions available now.',
    cta: 'Shop New',
    href: '/products?newArrivals=true',
    image: '/images/hero/new-arrivals.png',
    bgGradient: 'from-[#1a1a1a] via-[#2a2520] to-[#3d2e18]',
    accentColor: '#D4A853',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goTo = useCallback((index) => {
    setCurrent(index);
  }, []);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const slide = slides[current];

  return (
    <section
      className="relative w-full h-[600px] md:h-[700px] lg:h-[85vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      id="hero-carousel"
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`}
        />
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          {/* Text content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${slide.id}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-white"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block text-sm md:text-base font-medium uppercase tracking-[0.2em] mb-3"
                style={{ color: slide.accentColor }}
              >
                {slide.subtitle}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/70 text-base md:text-lg max-w-md mb-8"
              >
                {slide.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 text-base font-semibold group h-12"
                  id={`hero-cta-${slide.id}`}
                >
                  <Link href={slide.href} className="inline-flex items-center justify-center gap-2">
                    <span>{slide.cta}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Shoe image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`image-${slide.id}`}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="hidden md:flex items-center justify-center"
            >
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative w-full max-w-lg"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  width={600}
                  height={600}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                />
                {/* Glow effect behind shoe */}
                <div
                  className="absolute inset-0 blur-3xl opacity-30 -z-10 scale-75"
                  style={{ backgroundColor: slide.accentColor }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Previous slide"
        id="hero-prev"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Next slide"
        id="hero-next"
      >
        <ChevronRight size={20} />
      </button>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((s, index) => (
          <button
            key={s.id}
            onClick={() => goTo(index)}
            className={`transition-all duration-300 ${
              index === current
                ? 'w-8 h-2 rounded-full bg-accent'
                : 'w-2 h-2 rounded-full bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to ${s.title}`}
            id={`hero-dot-${s.id}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <motion.div
          key={current}
          initial={{ width: '0%' }}
          animate={{ width: isPaused ? undefined : '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-full bg-accent"
        />
      </div>
    </section>
  );
}
