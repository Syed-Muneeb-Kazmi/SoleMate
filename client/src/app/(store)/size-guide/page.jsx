'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Ruler, CheckCircle, Info } from 'lucide-react';
import ScrollReveal from '@/components/store/ScrollReveal';

export default function SizeGuidePage() {
  const [activeGender, setActiveGender] = useState('men');

  const menSizes = [
    { us: '7', uk: '6', eu: '40', cm: '25.0', inches: '9.8"' },
    { us: '7.5', uk: '6.5', eu: '40.5', cm: '25.5', inches: '10.0"' },
    { us: '8', uk: '7', eu: '41', cm: '26.0', inches: '10.2"' },
    { us: '8.5', uk: '7.5', eu: '42', cm: '26.5', inches: '10.4"' },
    { us: '9', uk: '8', eu: '42.5', cm: '27.0', inches: '10.6"' },
    { us: '9.5', uk: '8.5', eu: '43', cm: '27.5', inches: '10.8"' },
    { us: '10', uk: '9', eu: '44', cm: '28.0', inches: '11.0"' },
    { us: '10.5', uk: '9.5', eu: '44.5', cm: '28.5', inches: '11.2"' },
    { us: '11', uk: '10', eu: '45', cm: '29.0', inches: '11.4"' },
    { us: '12', uk: '11', eu: '46', cm: '30.0', inches: '11.8"' },
    { us: '13', uk: '12', eu: '47.5', cm: '31.0', inches: '12.2"' },
  ];

  const womenSizes = [
    { us: '5', uk: '2.5', eu: '35.5', cm: '22.0', inches: '8.7"' },
    { us: '5.5', uk: '3', eu: '36', cm: '22.5', inches: '8.9"' },
    { us: '6', uk: '3.5', eu: '36.5', cm: '23.0', inches: '9.1"' },
    { us: '6.5', uk: '4', eu: '37', cm: '23.5', inches: '9.3"' },
    { us: '7', uk: '4.5', eu: '37.5', cm: '24.0', inches: '9.4"' },
    { us: '7.5', uk: '5', eu: '38', cm: '24.5', inches: '9.6"' },
    { us: '8', uk: '5.5', eu: '38.5', cm: '25.0', inches: '9.8"' },
    { us: '8.5', uk: '6', eu: '39', cm: '25.5', inches: '10.0"' },
    { us: '9', uk: '6.5', eu: '40', cm: '26.0', inches: '10.2"' },
    { us: '10', uk: '7.5', eu: '41', cm: '27.0', inches: '10.6"' },
  ];

  const kidsSizes = [
    { us: '10K', uk: '9.5', eu: '27', cm: '16.5', inches: '6.5"' },
    { us: '11K', uk: '10.5', eu: '28', cm: '17.5', inches: '6.9"' },
    { us: '12K', uk: '11.5', eu: '30', cm: '18.5', inches: '7.3"' },
    { us: '13K', uk: '12.5', eu: '31', cm: '19.5', inches: '7.7"' },
    { us: '1Y', uk: '13.5', eu: '32', cm: '20.0', inches: '7.9"' },
    { us: '2Y', uk: '1.5', eu: '33.5', cm: '21.0', inches: '8.3"' },
    { us: '3Y', uk: '2.5', eu: '35', cm: '22.0', inches: '8.7"' },
  ];

  const sizeData = activeGender === 'men' ? menSizes : activeGender === 'women' ? womenSizes : kidsSizes;

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
      {/* Hero */}
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
            <Ruler size={14} /> Perfect Fit Finder
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Shoe Size Conversion & Guide
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Find your exact size across international sizing standards. Measure accurately for maximum comfort.
          </p>
        </div>
      </ScrollReveal>

      {/* Gender Switcher Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1.5 rounded-full bg-muted border border-border">
          {['men', 'women', 'kids'].map((gender) => (
            <button
              key={gender}
              onClick={() => setActiveGender(gender)}
              className={`px-6 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                activeGender === gender
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {gender}&apos;s Sizing
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <ScrollReveal className="mb-16">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl capitalize">{activeGender}&apos;s Size Chart</h2>
            <span className="text-xs text-muted-foreground">Standard Width (D/B)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-xs tracking-wider">
                  <th className="py-3 px-6">US Size</th>
                  <th className="py-3 px-6">UK Size</th>
                  <th className="py-3 px-6">EU Size</th>
                  <th className="py-3 px-6">Foot Length (CM)</th>
                  <th className="py-3 px-6">Foot Length (Inches)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {sizeData.map((row) => (
                  <tr key={row.us} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-accent">{row.us}</td>
                    <td className="py-3.5 px-6 font-medium">{row.uk}</td>
                    <td className="py-3.5 px-6 font-medium">{row.eu}</td>
                    <td className="py-3.5 px-6 text-muted-foreground">{row.cm} cm</td>
                    <td className="py-3.5 px-6 text-muted-foreground">{row.inches}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>

      {/* How to measure */}
      <div className="bg-card border border-border rounded-2xl p-8 md:p-10 mb-12">
        <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
          <Info className="text-accent" size={24} /> How to Measure Your Foot Length
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <span className="font-heading font-bold text-lg text-accent">Step 1</span>
            <h3 className="font-semibold text-base">Trace Your Foot</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Place a sheet of paper on a hard floor against a wall. Stand straight with your heel lightly touching the wall and trace the outline of your foot.
            </p>
          </div>
          <div className="space-y-2">
            <span className="font-heading font-bold text-lg text-accent">Step 2</span>
            <h3 className="font-semibold text-base">Measure Heel-to-Toe</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Use a ruler to measure the distance from the back of your heel to the tip of your longest toe in centimeters or inches.
            </p>
          </div>
          <div className="space-y-2">
            <span className="font-heading font-bold text-lg text-accent">Step 3</span>
            <h3 className="font-semibold text-base">Find Your Match</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Compare your measurement with our chart above. If you fall between sizes, we recommend sizing up for athletic or running shoes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
