'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/store/ProductCard';
import ScrollReveal from '@/components/store/ScrollReveal';
import { productsAPI, categoriesAPI } from '@/lib/api';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name_asc', label: 'Name: A to Z' },
];

const sizeOptions = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12', '13'];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filter states from URL
  const currentCategory = searchParams.get('category') || '';
  const currentGender = searchParams.get('gender') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentSize = searchParams.get('size') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentFeatured = searchParams.get('featured') || '';
  const currentNewArrivals = searchParams.get('newArrivals') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  const selectedCategories = currentCategory ? currentCategory.split(',').filter(Boolean) : [];
  const selectedGenders = currentGender ? currentGender.split(',').filter(Boolean) : [];
  const selectedBrands = currentBrand ? currentBrand.split(',').filter(Boolean) : [];
  const selectedSizes = currentSize ? currentSize.split(',').filter(Boolean) : [];

  const [priceRange, setPriceRange] = useState([
    currentMinPrice ? parseInt(currentMinPrice) : 0,
    currentMaxPrice ? parseInt(currentMaxPrice) : 100000,
  ]);

  useEffect(() => {
    setPriceRange([
      currentMinPrice ? parseInt(currentMinPrice) : 0,
      currentMaxPrice ? parseInt(currentMaxPrice) : 100000,
    ]);
  }, [currentMinPrice, currentMaxPrice]);

  // Fetch categories and brands on mount
  useEffect(() => {
    categoriesAPI.getAll().then(res => setCategories(res.data || [])).catch(() => {});
    productsAPI.getBrands().then(res => setBrands(res.data || [])).catch(() => {});
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
          sort: currentSort,
        };
        if (currentCategory) params.category = currentCategory;
        if (currentGender) params.gender = currentGender;
        if (currentBrand) params.brand = currentBrand;
        if (currentSize) params.size = currentSize;
        if (currentSearch) params.search = currentSearch;
        if (currentFeatured) params.featured = currentFeatured;
        if (currentNewArrivals) params.newArrivals = currentNewArrivals;
        if (currentMinPrice) params.minPrice = currentMinPrice;
        if (currentMaxPrice) params.maxPrice = currentMaxPrice;

        const res = await productsAPI.getAll(params);
        setProducts(Array.isArray(res?.data) ? res.data : []);
        setPagination(res.pagination || {});
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentCategory, currentGender, currentBrand, currentSize, currentSort, currentSearch, currentPage, currentFeatured, currentNewArrivals, currentMinPrice, currentMaxPrice]);

  const updateFilter = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') {
      params.set('page', '1');
    }
    router.push(`/products?${params.toString()}`);
  }, [searchParams, router]);

  const toggleMultiFilter = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentStr = params.get(key) || '';
    const currentList = currentStr ? currentStr.split(',').filter(Boolean) : [];
    
    let newList;
    if (currentList.includes(value)) {
      newList = currentList.filter(item => item !== value);
    } else {
      newList = [...currentList, value];
    }

    if (newList.length > 0) {
      params.set(key, newList.join(','));
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  }, [searchParams, router]);

  const removeSingleFilterValue = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentStr = params.get(key) || '';
    const currentList = currentStr ? currentStr.split(',').filter(Boolean) : [];
    const newList = currentList.filter(item => item !== value);

    if (newList.length > 0) {
      params.set(key, newList.join(','));
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  }, [searchParams, router]);

  const clearFilters = useCallback(() => {
    router.push('/products');
  }, [router]);

  const activeFilterCount = [currentCategory, currentGender, currentBrand, currentSize, currentMinPrice, currentMaxPrice, currentFeatured, currentNewArrivals].filter(Boolean).length;

  // Page title
  let pageTitle = 'All Shoes';
  if (selectedGenders.length === 1 && selectedGenders[0] === 'men') pageTitle = "Men's Shoes";
  else if (selectedGenders.length === 1 && selectedGenders[0] === 'women') pageTitle = "Women's Shoes";
  else if (selectedGenders.length === 1 && selectedGenders[0] === 'kids') pageTitle = "Kids' Shoes";
  else if (currentSearch) pageTitle = `Results for "${currentSearch}"`;
  else if (currentFeatured) pageTitle = 'Featured Products';
  else if (currentNewArrivals) pageTitle = 'New Arrivals';

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Gender */}
      <Accordion type="multiple" defaultValue={['gender', 'category', 'brand', 'size', 'price']}>
        <AccordionItem value="gender">
          <AccordionTrigger className="text-sm font-semibold">Gender</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {['men', 'women', 'kids', 'unisex'].map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={selectedGenders.includes(g)}
                    onCheckedChange={() => toggleMultiFilter('gender', g)}
                  />
                  <span className="capitalize">{g}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-semibold">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((cat) => {
                const isChecked = selectedCategories.includes(cat.slug) || selectedCategories.includes(cat._id);
                const valueToToggle = cat.slug || cat._id;
                return (
                  <label key={cat._id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleMultiFilter('category', valueToToggle)}
                    />
                    <span>{cat.name}</span>
                  </label>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger className="text-sm font-semibold">Brand</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleMultiFilter('brand', brand)}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger className="text-sm font-semibold">Size</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => {
                const isChecked = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleMultiFilter('size', size)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      isChecked
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                onValueCommit={(value) => {
                  updateFilter('minPrice', value[0] > 0 ? String(value[0]) : '');
                  updateFilter('maxPrice', value[1] < 100000 ? String(value[1]) : '');
                }}
                min={0}
                max={100000}
                step={1000}
                className="mb-4"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>PKR {priceRange[0].toLocaleString()}</span>
                <span>PKR {priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <ScrollReveal>
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{pageTitle}</h1>
          <p className="text-muted-foreground">
            {pagination.total !== undefined ? `${pagination.total} products found` : 'Loading...'}
          </p>
        </div>
      </ScrollReveal>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          {/* Mobile filter toggle */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden" id="mobile-filter-toggle">
                <SlidersHorizontal size={16} className="mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 bg-accent text-accent-foreground">{activeFilterCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <FilterPanel />
              </div>
            </SheetContent>
          </Sheet>

          {/* Active filter badges */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            {selectedGenders.map(g => (
              <Badge key={g} variant="secondary" className="gap-1 capitalize">
                {g} <X size={12} className="cursor-pointer" onClick={() => removeSingleFilterValue('gender', g)} />
              </Badge>
            ))}
            {selectedCategories.map(c => {
              const catObj = categories.find(cat => cat.slug === c || cat._id === c);
              const name = catObj ? catObj.name : c;
              return (
                <Badge key={c} variant="secondary" className="gap-1">
                  {name} <X size={12} className="cursor-pointer" onClick={() => removeSingleFilterValue('category', c)} />
                </Badge>
              );
            })}
            {selectedBrands.map(b => (
              <Badge key={b} variant="secondary" className="gap-1">
                {b} <X size={12} className="cursor-pointer" onClick={() => removeSingleFilterValue('brand', b)} />
              </Badge>
            ))}
            {selectedSizes.map(s => (
              <Badge key={s} variant="secondary" className="gap-1">
                Size {s} <X size={12} className="cursor-pointer" onClick={() => removeSingleFilterValue('size', s)} />
              </Badge>
            ))}
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-accent hover:underline">
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle (Grid / List) */}
          <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-card">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Grid view"
              title="Grid View"
              id="grid-view-toggle"
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="List view"
              title="List View"
              id="list-view-toggle"
            >
              <LayoutList size={18} />
            </button>
          </div>

          <Select value={currentSort} onValueChange={(val) => updateFilter('sort', val)}>
            <SelectTrigger className="w-[190px]" id="sort-select">
              <SelectValue placeholder="Sort by">
                {sortOptions.find((opt) => opt.value === currentSort)?.label || 'Sort by'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32">
            <h3 className="font-heading font-semibold text-sm mb-4">Filters</h3>
            <FilterPanel />
          </div>
        </aside>

        {/* Product grid / list */}
        <div className="flex-1">
          {loading ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6" : "flex flex-col gap-4"}>
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-semibold mb-2">No products found</p>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6" : "flex flex-col gap-4"}>
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} viewMode={viewMode} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => updateFilter('page', String(currentPage - 1))}
                  >
                    Previous
                  </Button>
                  {[...Array(pagination.pages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilter('page', String(i + 1))}
                      className="w-10"
                    >
                      {i + 1}
                    </Button>
                  )).slice(Math.max(0, currentPage - 3), currentPage + 2)}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= pagination.pages}
                    onClick={() => updateFilter('page', String(currentPage + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
