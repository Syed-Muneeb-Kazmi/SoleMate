'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { RotateCcw, ShieldCheck, CheckCircle2, FileText, PackageCheck, RefreshCw, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/store/ScrollReveal';

export default function ReturnsExchangesPage() {
  const steps = [
    {
      num: '01',
      title: 'Initiate Return Online',
      desc: 'Go to your account order history or click Return Order below. Select items and reason for return.',
      icon: FileText,
    },
    {
      num: '02',
      title: 'Print Prepaid Label',
      desc: 'Download and print the prepaid return shipping label provided instantly for easy drop-off.',
      icon: RotateCcw,
    },
    {
      num: '03',
      title: 'Pack & Drop Off',
      desc: 'Box your unworn shoes in their original packaging, affix the label, and drop off at any carrier location.',
      icon: PackageCheck,
    },
    {
      num: '04',
      title: 'Fast Refund / Exchange',
      desc: 'As soon as we receive and inspect your package, your refund or exchange will be processed within 48 hours.',
      icon: RefreshCw,
    },
  ];

  const eligibility = [
    'Items must be unworn, undamaged, and in original condition.',
    'Must be returned in original shoe box with tags intact.',
    'Returned within 30 days of original delivery date.',
    'Proof of purchase or order number required.',
    'Final sale or customized items cannot be returned unless defective.',
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
      {/* Hero */}
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck size={14} /> Hassle-Free Process
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Returns & Exchanges Policy
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            We want you to love every pair you buy. If the fit isn’t perfect, return or exchange your unworn shoes within 30 days for free.
          </p>
        </div>
      </ScrollReveal>

      {/* 30-Day Highlight Banner */}
      <div className="bg-card border border-accent/30 rounded-2xl p-8 mb-16 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center font-heading font-extrabold text-2xl shrink-0">
            30
          </div>
          <div>
            <h2 className="font-heading text-xl md:text-2xl font-bold mb-1">30-Day Risk-Free Trial</h2>
            <p className="text-muted-foreground text-sm">
              Try your shoes indoors on clean surfaces. If they don’t fit, return them hassle-free.
            </p>
          </div>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors shrink-0 shadow-sm"
        >
          Start a Return <ArrowRight size={16} />
        </Link>
      </div>

      {/* 4-Step Process */}
      <ScrollReveal className="mb-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">How Returns Work</h2>
          <p className="text-muted-foreground text-sm">Four quick steps to complete your return or size exchange.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 relative flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading font-extrabold text-2xl text-accent">{step.num}</span>
                    <div className="w-10 h-10 rounded-lg bg-muted text-foreground flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Eligibility Checklist */}
      <div className="bg-muted/40 border border-border rounded-2xl p-8 md:p-10 mb-16">
        <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
          <CheckCircle2 className="text-accent" size={24} /> Return Eligibility Criteria
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eligibility.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-foreground/90">
              <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
