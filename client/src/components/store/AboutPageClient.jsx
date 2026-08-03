'use client';

import { motion } from 'motion/react';
import { Heart, Award, Users, Globe } from 'lucide-react';
import ScrollReveal from '@/components/store/ScrollReveal';

const stats = [
  { icon: Users, value: '50K+', label: 'Happy Customers' },
  { icon: Award, value: '200+', label: 'Shoe Styles' },
  { icon: Globe, value: '30+', label: 'Countries Served' },
  { icon: Heart, value: '4.9', label: 'Average Rating' },
];

export default function AboutPageClient() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">Our <span className="text-accent">Story</span></h1>
            <p className="text-primary-foreground/60 text-lg max-w-2xl mx-auto">
              Founded with a belief that great footwear should be accessible to everyone.
              We craft shoes that look incredible, feel amazing, and last.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <stat.icon size={28} className="text-accent mx-auto mb-3" />
                  <p className="font-heading text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              At SoleMate, we believe every step matters. Our mission is to combine cutting-edge comfort technology with timeless design, creating footwear that empowers you to move through life with confidence and style.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From the running track to the boardroom, from playgrounds to city streets — we engineer shoes for every moment. Each pair is crafted with premium materials, thoughtful design, and an obsession for quality that you can feel with every stride.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold text-center mb-12">What We Stand For</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: 'Quality First', desc: 'We use only premium materials and rigorous quality testing. Every pair is built to last.' },
              { title: 'Comfort Always', desc: 'Advanced cushioning, ergonomic design, and breathable materials keep your feet happy all day.' },
              { title: 'Style Forward', desc: 'Our design team stays ahead of trends while honoring timeless silhouettes that never go out of fashion.' },
            ].map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.15}>
                <div className="p-6 rounded-xl bg-card border border-border text-center">
                  <h3 className="font-heading text-lg font-bold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
