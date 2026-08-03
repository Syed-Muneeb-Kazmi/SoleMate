'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Search, ChevronDown, MessageSquare, Mail, Phone, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/store/ScrollReveal';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'orders', name: 'Orders & Payments' },
    { id: 'shipping', name: 'Shipping & Delivery' },
    { id: 'returns', name: 'Returns & Refunds' },
    { id: 'products', name: 'Products & Sizing' },
    { id: 'account', name: 'Account & Support' },
  ];

  const faqs = [
    {
      cat: 'orders',
      q: 'How do I place an order on SoleMate?',
      a: 'Browse our catalog, select your desired size and color, click "Add to Cart", and proceed to checkout. You can check out as a guest or create an account for faster checkout.',
    },
    {
      cat: 'orders',
      q: 'What payment methods do you accept?',
      a: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and Cash on Delivery (COD) in select locations.',
    },
    {
      cat: 'shipping',
      q: 'How much does shipping cost?',
      a: 'Standard shipping is FREE on all orders over PKR 10,000. For orders under PKR 10,000, standard shipping is a flat rate of PKR 499 within Pakistan.',
    },
    {
      cat: 'shipping',
      q: 'How long will my order take to arrive?',
      a: 'Standard shipping takes 2-4 business days within Pakistan. Express shipping takes 1-2 business days. Same day delivery is available in major cities for orders placed before noon.',
    },
    {
      cat: 'returns',
      q: 'What is your return policy?',
      a: 'We offer a 30-day risk-free return policy. Unworn items in original box and packaging can be returned for a full refund or exchange.',
    },
    {
      cat: 'returns',
      q: 'How long does a refund take to process?',
      a: 'Once your returned package arrives at our warehouse and is inspected, refunds are credited back to your original payment method within 48-72 hours.',
    },
    {
      cat: 'products',
      q: 'Are your shoes 100% authentic?',
      a: 'Yes, absolutely. We source all footwear directly from authorized brand distributors and manufacturers. Every pair comes with a 100% authenticity guarantee.',
    },
    {
      cat: 'products',
      q: 'How do I know what size to order?',
      a: 'Check our comprehensive Size Guide page for exact measurements in US, UK, EU, and CM. If you are between sizes, we recommend sizing up.',
    },
    {
      cat: 'account',
      q: 'Do I need an account to shop?',
      a: 'No, you can check out as a guest. However, creating an account lets you track order status, save wishlist items, and store shipping addresses for faster future checkouts.',
    },
    {
      cat: 'account',
      q: 'How can I contact customer support?',
      a: 'You can reach us via live chat, email us at hello@solemate.pk, or call our customer hotline at +92 300 1234567 Monday through Friday 9 AM - 6 PM PKT.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = activeCategory === 'all' || faq.cat === activeCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
      {/* Hero */}
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle size={14} /> Knowledge Base
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-8">
            Have questions? We&apos;ve got answers. Search below or browse categories to find quick help.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-card border border-border focus:border-accent outline-none text-sm transition-all shadow-sm"
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setOpenIndex(null); }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat.id
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Accordions */}
      <div className="space-y-4 mb-16">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <HelpCircle size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-lg mb-1">No matching questions found</p>
            <p className="text-muted-foreground text-sm">Try searching for something else or contact support.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <span className="font-heading font-semibold text-base md:text-lg">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-accent' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-muted-foreground text-sm leading-relaxed border-t border-border/40">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Still Need Help */}
      <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-10 text-center">
        <h2 className="font-heading text-2xl font-bold mb-2">Still Have Questions?</h2>
        <p className="text-primary-foreground/70 text-sm max-w-lg mx-auto mb-6">
          Can&apos;t find what you are looking for? Our customer care team is available 24/7 to assist you.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors shadow-md"
          >
            <MessageSquare size={16} /> Contact Support
          </Link>
          <a
            href="mailto:hello@solemate.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-sm font-semibold transition-colors"
          >
            <Mail size={16} /> Email Us
          </a>
        </div>
      </div>
    </div>
  );
}
