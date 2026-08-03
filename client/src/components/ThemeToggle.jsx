'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ThemeToggle({ className = '' }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 ${className}`} />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`p-2.5 hover:bg-muted rounded-full transition-colors flex items-center justify-center ${className}`}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      id="theme-toggle"
    >
      {isDark ? (
        <Sun size={20} className="text-amber-400 transition-transform duration-300 hover:rotate-90" />
      ) : (
        <Moon size={20} className="text-slate-700 dark:text-slate-200 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
