'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Star, Heart, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useWishlist } from '@/context/WishlistContext';
import { getImageUrl, formatCurrency } from '@/lib/utils';

export default function ProductCard({ product, index = 0, viewMode = 'grid' }) {
  const {
    _id, name, slug, price, compareAtPrice, brand,
    images, ratingsAverage, ratingsCount,
    isFeatured, isNewArrival, colors, description,
  } = product;

  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(_id);

  const mainImage = getImageUrl(images?.[0]);
  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(_id);
    toast[wishlisted ? 'info' : 'success'](
      wishlisted ? 'Removed from wishlist' : 'Added to wishlist!',
      { description: name, duration: 2000 }
    );
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        className="group relative bg-card border border-border rounded-xl p-4 transition-all hover:shadow-md"
      >
        <Link href={`/product/${slug}`} className="flex flex-col sm:flex-row gap-5 items-stretch" id={`product-card-${slug}`}>
          {/* Image container */}
          <div className="relative w-full sm:w-48 h-48 rounded-lg overflow-hidden bg-muted shrink-0">
            <Image
              src={mainImage}
              alt={name}
              fill
              sizes="200px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isNewArrival && (
                <Badge className="bg-accent text-accent-foreground text-xs font-semibold">New</Badge>
              )}
              {discount > 0 && (
                <Badge variant="destructive" className="text-xs font-semibold">-{discount}%</Badge>
              )}
            </div>

            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md z-10 ${
                wishlisted
                  ? 'bg-red-500 text-white scale-110'
                  : 'bg-white/90 dark:bg-card/90 text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Product info */}
          <div className="flex-1 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{brand}</p>
                {ratingsCount > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < Math.round(ratingsAverage) ? 'fill-accent text-accent' : 'fill-muted text-muted'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({ratingsCount})</span>
                  </div>
                )}
              </div>

              <h3 className="font-heading font-semibold text-base sm:text-lg mb-1 group-hover:text-accent transition-colors">
                {name}
              </h3>

              {description && (
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3">
                  {description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg">{formatCurrency(price)}</span>
                {compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">{formatCurrency(compareAtPrice)}</span>
                )}
              </div>

              {/* Color swatches */}
              {colors && colors.length > 0 && (
                <div className="flex items-center gap-1.5">
                  {colors.slice(0, 4).map((color) => (
                    <div
                      key={color.name}
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                  {colors.length > 4 && (
                    <span className="text-xs text-muted-foreground">+{colors.length - 4}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative"
    >
      <Link href={`/product/${slug}`} className="block" id={`product-card-${slug}`}>
        {/* Image container */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-3">
          <Image
            src={mainImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNewArrival && (
              <Badge className="bg-accent text-accent-foreground text-xs font-semibold">New</Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="text-xs font-semibold">-{discount}%</Badge>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md z-10 ${
              wishlisted
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white/90 dark:bg-card/90 text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
          </button>

          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <motion.div
              initial={{ y: 10 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg"
            >
              <Eye size={16} />
              Quick View
            </motion.div>
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{brand}</p>
          <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {name}
          </h3>

          {/* Rating */}
          {ratingsCount > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < Math.round(ratingsAverage) ? 'fill-accent text-accent' : 'fill-muted text-muted'}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({ratingsCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-base">{formatCurrency(price)}</span>
            {compareAtPrice > 0 && compareAtPrice > price && (
              <span className="text-sm text-muted-foreground line-through">{formatCurrency(compareAtPrice)}</span>
            )}
          </div>

          {/* Color swatches */}
          {colors && colors.length > 1 && (
            <div className="flex items-center gap-1.5 pt-1">
              {colors.slice(0, 4).map((color) => (
                <div
                  key={color.name}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {colors.length > 4 && (
                <span className="text-xs text-muted-foreground">+{colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
