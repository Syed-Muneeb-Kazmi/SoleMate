'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Logo } from '@/components/Logo';


const quickLinks = [
  { href: '/products?gender=men', label: 'Men\'s Shoes' },
  { href: '/products?gender=women', label: 'Women\'s Shoes' },
  { href: '/products?gender=kids', label: 'Kids\' Shoes' },
  { href: '/products?featured=true', label: 'Featured' },
  { href: '/products?newArrivals=true', label: 'New Arrivals' },
];

const customerService = [
  { href: '/contact', label: 'Contact Us' },
  { href: '/about', label: 'About Us' },
  { href: '/shipping-info', label: 'Shipping Info' },
  { href: '/returns-exchanges', label: 'Returns & Exchanges' },
  { href: '/size-guide', label: 'Size Guide' },
  { href: '/faq', label: 'FAQ' },
];

const socialLinks = [
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground" id="site-footer">
      {/* Newsletter section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2">
              Stay in the <span className="text-accent">Loop</span>
            </h3>
            <p className="text-primary-foreground/60 mb-6">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent focus:ring-1 focus:ring-accent"
                id="newsletter-email"
              />
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0" id="newsletter-submit">
                <ArrowRight size={18} />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo inverted />
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6">
              Premium footwear for everyone. From running tracks to city streets,
              find your perfect sole mate for every step of life&apos;s journey.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5">
              {customerService.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/60">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                <span>I-8 Markaz<br />Islamabad, ISB 44000</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/60">
                <Phone size={16} className="shrink-0" />
                <span>+92-300-1234567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/60">
                <Mail size={16} className="shrink-0" />
                <span>solemate@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/40">
            <p>&copy; {new Date().getFullYear()} SoleMate. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-accent transition-colors">Terms of Service</Link>
              <Link href="/cookie-policy" className="hover:text-accent transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
