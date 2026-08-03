'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  Minus, Plus, ShoppingBag, Heart, Star, ChevronRight,
  Truck, RotateCcw, Shield, Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import ProductCard from '@/components/store/ProductCard';
import ScrollReveal from '@/components/store/ScrollReveal';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { productsAPI, reviewsAPI } from '@/lib/api';
import { formatCurrency, getImageUrl } from '@/lib/utils';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productsAPI.getBySlug(slug);
        setProduct(res.data);

        // Fetch reviews
        reviewsAPI.getForProduct(res.data._id).then(r => setReviews(r.data || [])).catch(() => {});

        // Fetch related products
        productsAPI.getAll({ category: res.data.category?._id, limit: 4 })
          .then(r => setRelatedProducts((r.data || []).filter(p => p._id !== res.data._id)))
          .catch(() => {});
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    const hasSizes = product.sizes && product.sizes.length > 0;
    if (hasSizes && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    setAddingToCart(true);
    const colorName = product.colors?.[selectedColor]?.name || '';
    const sizeToAdd = selectedSize || (hasSizes ? product.sizes[0].size : 'One Size');
    const result = await addToCart(product._id, sizeToAdd, colorName, quantity, product);
    if (result.success) {
      toast.success('Added to cart!', { description: `${product.name}${sizeToAdd !== 'One Size' ? ` Size ${sizeToAdd}` : ''}` });
    } else {
      toast.error(result.message || 'Failed to add to cart');
    }
    setAddingToCart(false);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    const wishlisted = isWishlisted(product._id);
    toggleWishlist(product._id);
    toast[wishlisted ? 'info' : 'success'](wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', { description: product.name, duration: 2000 });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold mb-4">Product Not Found</h1>
        <Button asChild><Link href="/products">Back to Shop</Link></Button>
      </div>
    );
  }

  const allImages = product.images || [];
  const colorImages = product.colors?.[selectedColor]?.images || [];
  const rawImages = [...colorImages, ...allImages.filter(img => !colorImages.includes(img))];
  const displayImages = rawImages.length > 0 ? rawImages.map(getImageUrl) : ['/images/placeholder-shoe.png'];
  const currentImage = displayImages[mainImage] || displayImages[0];
  const selectedSizeInfo = product.sizes?.find(s => s.size === selectedSize);
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-foreground transition-colors">Shop</Link>
        <ChevronRight size={14} />
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Main image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            {discount > 0 && (
              <Badge variant="destructive" className="absolute top-4 left-4 text-sm">
                -{discount}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {displayImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {displayImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                    mainImage === i ? 'border-accent' : 'border-transparent hover:border-border'
                  }`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">{product.brand}</p>
            <h1 className="font-heading text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.round(product.ratingsAverage) ? 'fill-accent text-accent' : 'fill-muted text-muted'} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.ratingsAverage > 0 ? `${product.ratingsAverage} (${product.ratingsCount} reviews)` : 'No reviews yet'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-heading text-3xl font-bold">{formatCurrency(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">{formatCurrency(product.compareAtPrice)}</span>
              )}
              {discount > 0 && (
                <Badge className="bg-destructive/10 text-destructive border-0">Save {formatCurrency(product.compareAtPrice - product.price)}</Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">
                Color: <span className="text-muted-foreground">{product.colors[selectedColor]?.name}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedColor(i); setMainImage(0); }}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === i ? 'border-accent scale-110 ring-2 ring-accent/20' : 'border-border hover:border-foreground'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Select Size</p>
                <button className="text-xs text-accent hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    disabled={s.stock === 0}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                      selectedSize === s.size
                        ? 'bg-primary text-primary-foreground border-primary'
                        : s.stock === 0
                          ? 'bg-muted text-muted-foreground border-border cursor-not-allowed line-through opacity-50'
                          : 'bg-background border-border hover:border-primary'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
              {selectedSizeInfo && (
                <p className={`text-xs mt-2 ${selectedSizeInfo.stock <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {selectedSizeInfo.stock <= 5 ? `Only ${selectedSizeInfo.stock} left!` : '✓ In Stock'}
                </p>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              One size fits all — or sizes not yet configured for this product.
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-muted transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-muted transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
              onClick={handleAddToCart}
              disabled={addingToCart}
              id="add-to-cart"
            >
              <ShoppingBag size={18} className="mr-2" />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className={`shrink-0 transition-colors ${isWishlisted(product._id) ? 'border-red-400 text-red-500 bg-red-50 hover:bg-red-100' : ''}`}
              onClick={handleWishlistToggle}
              aria-label="Add to wishlist"
            >
              <Heart size={18} className={isWishlisted(product._id) ? 'fill-current' : ''} />
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, text: 'Free Shipping' },
              { icon: RotateCcw, text: '30-Day Returns' },
              { icon: Shield, text: 'Secure Payment' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50 text-center">
                <Icon size={18} className="text-accent" />
                <span className="text-xs">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tabs: Description, Reviews */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3">
              Description
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="max-w-3xl">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-4 max-w-3xl">
                {reviews.map((review) => (
                  <div key={review._id} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">{[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? 'fill-accent text-accent' : 'fill-muted text-muted'} />
                      ))}</div>
                      <span className="text-sm font-medium">{review.user?.name || 'Anonymous'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold mb-6">You May Also Like</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.slice(0, 4).map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
