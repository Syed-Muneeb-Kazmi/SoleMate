'use client';

import ScrollReveal from '@/components/store/ScrollReveal';
import { Scale, FileCheck, ShoppingBag, CreditCard, ShieldAlert, Copyright } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
      {/* Hero */}
      <ScrollReveal>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
            <Scale size={14} /> Legal Agreement
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">
            Terms of Service
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
            <FileCheck size={20} className="text-accent" /> 1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the SoleMate website, purchasing products, or engaging with our online services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you must discontinue use of our platform immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag size={20} className="text-accent" /> 2. Products, Orders & Pricing
          </h2>
          <p>
            All products displayed on our store are subject to availability. We reserve the right to limit order quantities, discontinue items without prior notice, and refuse service to any customer if fraudulent or suspicious activity is detected.
          </p>
          <p>
            Prices are displayed in Pakistani Rupees (PKR) and exclude applicable sales taxes or shipping fees unless specified. While we make every effort to ensure accurate pricing, errors may occur. In the event of a pricing error, we reserve the right to cancel affected orders and issue a full refund.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <CreditCard size={20} className="text-accent" /> 3. Payment & Billing
          </h2>
          <p>
            You agree to provide accurate and complete billing, shipping, and payment information for all orders. You represent and warrant that you are authorized to use the chosen payment method. Orders are confirmed only upon successful authorization and receipt of funds.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Copyright size={20} className="text-accent" /> 4. Intellectual Property
          </h2>
          <p>
            All content on the SoleMate platform—including logos, product designs, brand names, graphics, text, images, and software—is the exclusive property of SoleMate Footwear Inc. or its brand licensors. Reproduction, distribution, or commercial exploitation of any material without explicit written consent is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <ShieldAlert size={20} className="text-accent" /> 5. Limitation of Liability
          </h2>
          <p>
            SoleMate shall not be liable for any indirect, incidental, consequential, or punitive damages arising out of your use of our site, products, or services. Our total liability for any claim arising from a transaction shall not exceed the total price paid for the product in question.
          </p>
        </section>
      </div>
    </div>
  );
}
