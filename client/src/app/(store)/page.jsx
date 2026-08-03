'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import HeroCarousel from '@/components/store/HeroCarousel';
import ProductCard from '@/components/store/ProductCard';
import ScrollReveal from '@/components/store/ScrollReveal';
import { productsAPI } from '@/lib/api';

const categories = [
  { name: 'Men', href: '/products?gender=men', image: '/images/categories/men.png', description: 'Performance & style' },
  { name: 'Women', href: '/products?gender=women', image: '/images/categories/women.png', description: 'Elegance meets comfort' },
  { name: 'Kids', href: '/products?gender=kids', image: '/images/categories/kids.png', description: 'Built for adventure' },
];

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over PKR 10,000' },
  { icon: Shield, title: 'Secure Payment', description: '100% protected checkout' },
  { icon: RefreshCw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: Headphones, title: '24/7 Support', description: 'Always here to help' },
];

const testimonials = [
  { name: 'Michael R.', rating: 5, text: 'The Velocity Runners are incredible. Best running shoes I\'ve ever owned. The cushioning is unmatched.', role: 'Marathon Runner' },
  { name: 'Jessica T.', rating: 5, text: 'SoleMate shoes are my go-to for both work and weekend. The quality is premium without the premium price tag.', role: 'Fashion Blogger' },
  { name: 'David K.', rating: 5, text: 'Got my kids the Little Explorer and they haven\'t taken them off since! Great quality and super easy velcro straps.', role: 'Parent of Two' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    productsAPI.getFeatured().then(res => setFeatured(Array.isArray(res?.data) ? res.data : [])).catch(() => setFeatured([]));
    productsAPI.getNewArrivals().then(res => setNewArrivals(Array.isArray(res?.data) ? res.data : [])).catch(() => setNewArrivals([]));
  }, []);

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features bar */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.1}>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <feature.icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="py-16 md:py-24" id="categories-section">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
                Shop by <span className="text-accent">Category</span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Find the perfect pair for every member of the family
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.name} delay={i * 0.15}>
                <Link href={cat.href} className="group block" id={`category-${cat.name.toLowerCase()}`}>
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <p className="text-sm text-white/70 mb-1">{cat.description}</p>
                      <h3 className="font-heading text-2xl font-bold mb-3">{cat.name}</h3>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
                        Shop Now <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16 bg-muted/30" id="featured-section">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                    Featured <span className="text-accent">Products</span>
                  </h2>
                  <p className="text-muted-foreground">Handpicked by our style experts</p>
                </div>
                <Button variant="outline" asChild className="hidden md:flex">
                  <Link href="/products?featured=true">
                    View All <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.slice(0, 8).map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/products?featured=true">View All Featured</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground p-8 md:p-16">
              <div className="relative z-10 max-w-lg">
                <span className="inline-block text-accent text-sm font-semibold uppercase tracking-wider mb-3">
                  Limited Time Offer
                </span>
                <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 leading-tight">
                  Up to 40% Off<br />New Arrivals
                </h2>
                <p className="text-primary-foreground/60 mb-8 text-lg">
                  Don&apos;t miss out on our biggest sale of the season. Premium shoes at unbeatable prices.
                </p>
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8"
                  asChild
                >
                  <Link href="/products?newArrivals=true">
                    Shop the Sale <ArrowRight size={18} className="ml-2" />
                  </Link>
                </Button>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                <div className="absolute inset-0 bg-gradient-to-l from-accent/30 to-transparent" />
              </div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-accent/5" />
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/5" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16 bg-muted/30" id="new-arrivals-section">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                    New <span className="text-accent">Arrivals</span>
                  </h2>
                  <p className="text-muted-foreground">Fresh styles just landed</p>
                </div>
                <Button variant="outline" asChild className="hidden md:flex">
                  <Link href="/products?newArrivals=true">
                    View All <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.slice(0, 8).map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-16 md:py-24" id="testimonials-section">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
                What Our Customers <span className="text-accent">Say</span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Join thousands of happy customers worldwide
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <ScrollReveal key={testimonial.name} delay={i * 0.15}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-6">
                    <Quote size={24} className="text-accent/30 mb-4" />
                    <div className="flex items-center gap-0.5 mb-3">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} size={14} className="fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                      &quot;{testimonial.text}&quot;
                    </p>
                    <div>
                      <p className="text-sm font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                The Sole<span className="text-accent">Mate</span> Story
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded with a simple belief: everyone deserves footwear that looks incredible,
                feels amazing, and lasts. We combine cutting-edge technology with timeless design
                to create shoes that move with you through every chapter of life.
              </p>
              <Button variant="outline" asChild>
                <Link href="/about">
                  Learn More <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
