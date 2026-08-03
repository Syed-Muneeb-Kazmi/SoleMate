'use client';

import ScrollReveal from '@/components/store/ScrollReveal';
import { ShieldCheck, Lock, Eye, FileText, Database, Bell } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
      {/* Hero */}
      <ScrollReveal>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck size={14} /> Data Protection
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm">
            Last Updated: January 1, 2026 &bull; SoleMate Footwear Inc.
          </p>
        </div>
      </ScrollReveal>

      {/* Main Content */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-10 space-y-8 text-foreground/90 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Lock size={20} className="text-accent" /> 1. Introduction & Overview
          </h2>
          <p>
            At SoleMate (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we respect your privacy and are committed to protecting your personal data. This Privacy Policy describes how we collect, use, store, share, and protect your personal information when you visit our website, place an order, create an account, or interact with our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Eye size={20} className="text-accent" /> 2. Information We Collect
          </h2>
          <p>We collect several types of information to provide and improve our services to you:</p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li><strong>Personal Identity Data:</strong> Name, email address, phone number, and shipping/billing address when you make a purchase or register an account.</li>
            <li><strong>Payment & Financial Information:</strong> Encrypted payment card details processed securely via certified payment gateways (PayPal, Stripe, Visa/Mastercard). We do not store raw credit card numbers.</li>
            <li><strong>Technical & Usage Data:</strong> IP address, browser type, device information, operating system, and browsing behavior on our store pages.</li>
            <li><strong>Order History & Preferences:</strong> Wishlist items, cart contents, product reviews, and communications with customer support.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <FileText size={20} className="text-accent" /> 3. How We Use Your Data
          </h2>
          <p>We use your personal data for legitimate business purposes, including:</p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Processing, fulfilling, and delivering your footwear orders.</li>
            <li>Sending shipping updates, tracking notifications, and order receipts.</li>
            <li>Providing customer support and responding to inquiries.</li>
            <li>Personalizing your shopping experience and recommending relevant products.</li>
            <li>Preventing fraudulent transactions and ensuring security across our platforms.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Database size={20} className="text-accent" /> 4. Data Sharing & Security
          </h2>
          <p>
            We do not sell, rent, or trade your personal information to third parties. We share data only with trusted service providers necessary to operate our store (e.g. shipping carriers, payment processors, and analytics providers). All third parties are strictly bound by confidentiality and data processing agreements.
          </p>
          <p>
            We enforce industry-standard SSL encryption, secure servers, and regular security audits to protect your data against unauthorized access, loss, or misuse.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Bell size={20} className="text-accent" /> 5. Your Privacy Rights (GDPR & CCPA)
          </h2>
          <p>Depending on your location, you have rights regarding your personal data:</p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li><strong>Access & Portability:</strong> Request a copy of the personal information we hold about you.</li>
            <li><strong>Correction & Deletion:</strong> Request correction of inaccurate data or permanent deletion of your account and personal history.</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from marketing newsletters at any time via the link in our emails.</li>
          </ul>
          <p className="pt-2">
            To exercise any of your privacy rights, please contact our Privacy Team at <strong>privacy@solemate.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
