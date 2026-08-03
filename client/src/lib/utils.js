import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, options = {}) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(Number(amount) || 0);
}

export function getImageUrl(url) {
  if (!url) return '/images/placeholder-shoe.png';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // Handle uploaded images from backend server
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    let baseUrl = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';
    baseUrl = baseUrl.trim().replace(/\/$/, '');
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`;
    }
    return `${baseUrl}${cleanPath}`;
  }

  // Map any legacy .jpg/.jpeg paths in seed or user data to .png
  let cleanUrl = url.startsWith('/') ? url : `/${url}`;
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) {
    cleanUrl = cleanUrl.replace(/\.(jpg|jpeg)$/, '.png');
  }
  return cleanUrl;
}
