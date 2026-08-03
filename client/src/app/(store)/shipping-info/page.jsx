'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Truck, Clock, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/store/ScrollReveal';

export default function ShippingInfoPage() {
  const shippingMethods = [
    {
      title: 'Standard Shipping',
      time: '2 - 4 Business Days',
      cost: 'FREE over PKR 10,000 (PKR 499 under PKR 10,000)',
      desc: 'Reliable delivery across Pakistan via local couriers and Pakistan Post.',
      badge: 'Most Popular',
    },
    {
      title: 'Express Shipping',
      time: '1 - 2 Business Days',
      cost: 'PKR 799 Flat Rate',
      desc: 'Faster nationwide delivery with priority handling.',
    },
    {
      title: 'Same Day Delivery',
      time: 'Same Day',
      cost: 'PKR 1,299 Flat Rate',
      desc: 'Available in Karachi, Lahore, Islamabad, and select major cities for orders placed before noon.',
    },
    {
      title: 'International Shipping',
      time: '7 - 14 Business Days',
      cost: 'Calculated at Checkout',
      desc: 'Duties & taxes included at checkout for international orders.',
    },
  ];

  const regions = [
    { region: 'Within Pakistan', standard: '2-4 Days', express: '1-2 Days', overnight: 'Same Day (selected cities)' },
    { region: 'India & South Asia', standard: '6-10 Days', express: '4-7 Days', overnight: 'N/A' },
    { region: 'Middle East', standard: '7-12 Days', express: '4-6 Days', overnight: 'N/A' },
    { region: 'Europe & UK', standard: '8-14 Days', express: '4-6 Days', overnight: 'N/A' },
    { region: 'North America', standard: '10-16 Days', express: '5-8 Days', overnight: 'N/A' },
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
      {/* Hero */}
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
            <Truck size={14} /> Fast & Reliable Delivery
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Shipping & Delivery Information
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            We deliver premium footwear straight to your doorstep across Pakistan. Free shipping on all orders over PKR 10,000.
          </p>
        </div>
      </ScrollReveal>

      {/* Methods Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {shippingMethods.map((method, idx) => (
          <motion.div
            key={method.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative bg-card border border-border rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-all"
          >
            {method.badge && (
              <span className="absolute -top-3 right-4 bg-accent text-accent-foreground text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-sm">
                {method.badge}
              </span>
            )}
            <div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                <Truck size={20} />
              </div>
              <h3 className="font-heading font-bold text-lg mb-1">{method.title}</h3>
              <p className="text-accent font-medium text-sm mb-3 flex items-center gap-1">
                <Clock size={14} /> {method.time}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{method.desc}</p>
            </div>
            <div className="pt-4 border-t border-border/60">
              <span className="font-heading font-semibold text-sm text-foreground">{method.cost}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delivery Table */}
      <ScrollReveal className="mb-16">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold mb-1">Estimated Delivery Times</h2>
              <p className="text-muted-foreground text-sm">Delivery timelines vary by region and chosen shipping speed.</p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
              <Globe size={14} /> Ships from Karachi, Pakistan
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-xs tracking-wider">
                  <th className="py-3 px-4">Destination Region</th>
                  <th className="py-3 px-4">Standard</th>
                  <th className="py-3 px-4">Express</th>
                  <th className="py-3 px-4">Overnight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {regions.map((row) => (
                  <tr key={row.region} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium">{row.region}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{row.standard}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{row.express}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{row.overnight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>

      {/* Tracking Section */}
      <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">Track Your Order Status</h2>
          <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
            Once your order ships, we send an email with your tracking number. You can also view live tracking updates directly in your account dashboard.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/account?tab=orders"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors shadow-md"
            >
              View My Orders <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-sm font-semibold transition-colors"
            >
              Need Support?
            </Link>
          </div>
        </div>
        <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-accent shrink-0">
          <ShieldCheck size={48} />
        </div>
      </div>
    </div>
  );
}
