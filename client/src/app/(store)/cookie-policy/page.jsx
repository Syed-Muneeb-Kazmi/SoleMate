'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/store/ScrollReveal';
import { Cookie, Shield, Check, Settings, ToggleLeft, ToggleRight } from 'lucide-react';

export default function CookiePolicyPage() {
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    analytics: true,
    functional: true,
    marketing: false,
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const togglePref = (key) => {
    if (key === 'essential') return;
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    setSavedMsg(false);
  };

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
      {/* Hero */}
      <ScrollReveal>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
            <Cookie size={14} /> Transparency & Control
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">
            Cookie Policy
          </h1>
          <p className="text-muted-foreground text-sm">
            Last Updated: January 1, 2026 &bull; SoleMate Footwear Inc.
          </p>
        </div>
      </ScrollReveal>

      {/* Main Content */}
      <div className="space-y-8">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-10 space-y-4 text-foreground/90 text-sm leading-relaxed">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Cookie size={20} className="text-accent" /> What Are Cookies?
          </h2>
          <p>
            Cookies are small text files stored on your computer, smartphone, or tablet when you visit a website. They help the site remember your preferences, keep items in your shopping cart, maintain your logged-in status, and improve your overall browsing experience.
          </p>
        </div>

        {/* Preference Controls */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <Settings size={20} className="text-accent" /> Cookie Preferences
              </h2>
              <p className="text-muted-foreground text-xs mt-1">Manage which cookie types you allow us to use during your visits.</p>
            </div>
            {savedMsg && (
              <span className="inline-flex items-center gap-1 text-xs text-green-500 font-semibold bg-green-50 dark:bg-green-950/40 px-3 py-1 rounded-full">
                <Check size={14} /> Preferences Saved!
              </span>
            )}
          </div>

          <div className="space-y-4 divide-y divide-border/40">
            {/* Essential */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-sm">Strictly Necessary Cookies</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Required for basic website functions such as cart management, user authentication, and secure checkout. Cannot be disabled.
                </p>
              </div>
              <span className="text-xs font-semibold uppercase text-accent bg-accent/10 px-3 py-1 rounded-full shrink-0">
                Always Active
              </span>
            </div>

            {/* Analytics */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-sm">Performance & Analytics Cookies</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Help us understand how visitors interact with our pages, measure site speed, and identify navigation bottlenecks.
                </p>
              </div>
              <button onClick={() => togglePref('analytics')} className="text-accent hover:opacity-80 transition-opacity">
                {preferences.analytics ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-muted-foreground" />}
              </button>
            </div>

            {/* Functional */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-sm">Functional Cookies</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Remember your customized settings, language preferences, currency choices, and recent product views.
                </p>
              </div>
              <button onClick={() => togglePref('functional')} className="text-accent hover:opacity-80 transition-opacity">
                {preferences.functional ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-muted-foreground" />}
              </button>
            </div>

            {/* Marketing */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-sm">Marketing & Targeting Cookies</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Used by our advertising partners to deliver tailored shoe recommendations and relevant ads on other platforms.
                </p>
              </div>
              <button onClick={() => togglePref('marketing')} className="text-accent hover:opacity-80 transition-opacity">
                {preferences.marketing ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-muted-foreground" />}
              </button>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors shadow-sm"
            >
              Save Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
