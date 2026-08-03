'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Logo({
  href = '/',
  className = '',
  size = 'default', // 'sm' | 'default' | 'lg'
  inverted = false,
}) {
  const sizeClasses = {
    sm: 'h-9 w-[40px]',
    default: 'h-[54px] w-[60px] md:h-[68px] md:w-[75px]',
    lg: 'h-[64px] w-[70px] md:h-[80px] md:w-[88px]',
  };

  const dimensions = sizeClasses[size] || sizeClasses.default;

  return (
    <Link href={href} className={`inline-flex items-center shrink-0 my-auto ${className}`} id="logo-link">
      <div className={`relative ${dimensions} flex items-center justify-center`}>
        {/* Light mode logo (dark graphics): shown in light mode by default, or in dark mode when inverted */}
        <Image
          src="/images/SoleMate-light-logo.svg"
          alt="SoleMate"
          fill
          sizes="120px"
          className={`object-contain object-center ${inverted ? 'hidden dark:block' : 'dark:hidden'}`}
          priority
        />
        {/* Dark mode logo (light graphics): shown in dark mode by default, or in light mode when inverted */}
        <Image
          src="/images/SoleMate-dark-logo.svg"
          alt="SoleMate"
          fill
          sizes="120px"
          className={`object-contain object-center ${inverted ? 'dark:hidden' : 'hidden dark:block'}`}
          priority
        />
      </div>
    </Link>
  );
}
