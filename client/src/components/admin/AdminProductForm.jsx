'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Minus, Trash2, Upload, X, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { productsAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

const STANDARD_SIZES = ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'];

export default function AdminProductForm({ product, categories, onSuccess }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Basic fields
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price ? String(product.price) : '',
    compareAtPrice: product?.compareAtPrice ? String(product.compareAtPrice) : '',
    category: product?.category?._id || product?.category || '',
    brand: product?.brand || '',
    gender: product?.gender || 'men',
    tags: (product?.tags || []).join(', '),
    isFeatured: product?.isFeatured || false,
    isNewArrival: product?.isNewArrival || false,
  });

  // Sizes: { size, stock, enabled }
  const [sizes, setSizes] = useState(() =>
    STANDARD_SIZES.map(s => {
      const existing = product?.sizes?.find(ps => ps.size === s);
      return { size: s, stock: existing?.stock ?? 0, enabled: !!existing };
    })
  );

  // Colors: { name, hex }
  const [colors, setColors] = useState(
    product?.colors?.length
      ? product.colors.map(c => ({ name: c.name, hex: c.hex || '#000000' }))
      : []
  );

  // Images
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [saving, setSaving] = useState(false);

  const setField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  // Size handlers
  const toggleSize = (idx) => {
    setSizes(prev => prev.map((s, i) => i === idx ? { ...s, enabled: !s.enabled, stock: s.enabled ? s.stock : Math.max(s.stock, 0) } : s));
  };
  const updateStock = (idx, delta) => {
    setSizes(prev => prev.map((s, i) => i === idx ? { ...s, stock: Math.max(0, s.stock + delta) } : s));
  };
  const setStock = (idx, val) => {
    const num = parseInt(val);
    setSizes(prev => prev.map((s, i) => i === idx ? { ...s, stock: isNaN(num) ? 0 : Math.max(0, num) } : s));
  };

  // Color handlers
  const addColor = () => setColors(prev => [...prev, { name: '', hex: '#000000' }]);
  const removeColor = (idx) => setColors(prev => prev.filter((_, i) => i !== idx));
  const updateColor = (idx, key, val) => setColors(prev => prev.map((c, i) => i === idx ? { ...c, [key]: val } : c));

  // Image handlers
  const handleImageFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
  };
  const removeImageFile = (idx) => setImageFiles(prev => prev.filter((_, i) => i !== idx));
  const removeExistingImage = (url) => setExistingImages(prev => prev.filter(u => u !== url));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }

    setSaving(true);
    try {
      const enabledSizes = sizes.filter(s => s.enabled).map(({ size, stock }) => ({ size, stock }));
      const validColors = colors.filter(c => c.name.trim());

      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
        category: form.category || undefined,
        brand: form.brand.trim(),
        gender: form.gender,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        sizes: enabledSizes,
        colors: validColors,
        images: existingImages,
      };

      let savedProduct;
      if (product?._id) {
        const res = await productsAPI.update(product._id, body);
        savedProduct = res.data;
        toast.success('Product updated!');
      } else {
        const res = await productsAPI.create(body);
        savedProduct = res.data;
        toast.success('Product created!');
      }

      // Upload images if any
      if (imageFiles.length > 0 && savedProduct?._id) {
        const formData = new FormData();
        imageFiles.forEach(f => formData.append('images', f));
        try {
          await productsAPI.uploadImages(savedProduct._id, formData);
          toast.success(`${imageFiles.length} image(s) uploaded`);
        } catch (uploadErr) {
          toast.warning('Product saved but image upload failed: ' + (uploadErr.message || 'Unknown error'));
        }
      }

      if (onSuccess) onSuccess(savedProduct);
      else router.push('/admin/products');
    } catch (error) {
      toast.error(error.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const enabledCount = sizes.filter(s => s.enabled).length;
  const totalStock = sizes.filter(s => s.enabled).reduce((sum, s) => sum + s.stock, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: main info */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Info */}
          <Card>
            <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Product Name *</Label>
                <Input value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. Velocity Runner Pro" className="mt-1.5" required id="product-name" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Describe the product..." rows={4} className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Brand</Label>
                  <Input value={form.brand} onChange={e => setField('brand', e.target.value)} placeholder="e.g. Nike" className="mt-1.5" />
                </div>
                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input value={form.tags} onChange={e => setField('tags', e.target.value)} placeholder="running, lightweight..." className="mt-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price *</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rs</span>
                  <Input type="number" step="0.01" min="0" value={form.price} onChange={e => setField('price', e.target.value)} className="pl-7" placeholder="0.00" required />
                </div>
              </div>
              <div>
                <Label>Compare-at Price</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rs</span>
                  <Input type="number" step="0.01" min="0" value={form.compareAtPrice} onChange={e => setField('compareAtPrice', e.target.value)} className="pl-7" placeholder="0.00" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Shows as strikethrough to indicate discount</p>
              </div>
            </CardContent>
          </Card>

          {/* Sizes & Stock */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sizes & Stock</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {enabledCount} sizes · {totalStock} total units
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Select the sizes available for this product and set the stock quantity for each.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sizes.map((s, idx) => (
                  <div
                    key={s.size}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      s.enabled ? 'border-accent bg-accent/5' : 'border-border bg-muted/20'
                    }`}
                  >
                    {/* Size checkbox toggle */}
                    <button
                      type="button"
                      onClick={() => toggleSize(idx)}
                      className={`w-12 h-8 rounded-md text-xs font-bold flex-shrink-0 transition-colors ${
                        s.enabled ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {s.size}
                    </button>

                    {/* Stock controls */}
                    <div className={`flex items-center gap-1.5 flex-1 transition-opacity ${s.enabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                      <button
                        type="button"
                        onClick={() => updateStock(idx, -1)}
                        className="w-7 h-7 rounded border border-border bg-background hover:bg-muted flex items-center justify-center flex-shrink-0"
                      >
                        <Minus size={12} />
                      </button>
                      <Input
                        type="number"
                        min="0"
                        value={s.stock}
                        onChange={e => setStock(idx, e.target.value)}
                        className="w-16 h-7 text-center text-sm px-1"
                      />
                      <button
                        type="button"
                        onClick={() => updateStock(idx, 1)}
                        className="w-7 h-7 rounded border border-border bg-background hover:bg-muted flex items-center justify-center flex-shrink-0"
                      >
                        <Plus size={12} />
                      </button>
                      <span className="text-xs text-muted-foreground flex-shrink-0">units</span>
                    </div>
                  </div>
                ))}
              </div>
              {enabledCount === 0 && (
                <p className="text-sm text-amber-600 mt-3">⚠ No sizes selected. Click a size button to enable it.</p>
              )}
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Colors</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addColor}>
                  <Plus size={14} className="mr-1" /> Add Color
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {colors.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No colors added. Click &quot;Add Color&quot; to begin.</p>
              ) : (
                <div className="space-y-3">
                  {colors.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                      {/* Color picker */}
                      <div className="relative flex-shrink-0">
                        <input
                          type="color"
                          value={color.hex}
                          onChange={e => updateColor(idx, 'hex', e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border border-border p-0.5"
                          title="Pick color"
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            value={color.name}
                            onChange={e => updateColor(idx, 'name', e.target.value)}
                            placeholder="Color name (e.g. Midnight Black)"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Input
                            value={color.hex}
                            onChange={e => updateColor(idx, 'hex', e.target.value)}
                            placeholder="#000000"
                            className="text-sm font-mono"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeColor(idx)}
                        className="p-1.5 text-muted-foreground hover:text-destructive rounded transition-colors flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader><CardTitle>Product Images</CardTitle></CardHeader>
            <CardContent>
              {/* Existing images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Current Images</p>
                  <div className="flex flex-wrap gap-3">
                    {existingImages.map((url) => (
                      <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                        <Image src={getImageUrl(url)} alt="" fill sizes="80px" className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(url)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <X size={18} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New image upload */}
              <div>
                <p className="text-sm font-medium mb-2">Upload New Images</p>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors"
                >
                  <Upload size={28} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload images</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG, WebP supported</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageFiles}
                  className="hidden"
                />

                {/* New image previews */}
                {imageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {imageFiles.map((file, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-accent group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImageFile(idx)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <X size={18} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: classification & status */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Classification</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={val => setField('category', val)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories || []).map(cat => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={val => setField('gender', val)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Product Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Featured</p>
                  <p className="text-xs text-muted-foreground">Show on homepage</p>
                </div>
                <Switch checked={form.isFeatured} onCheckedChange={val => setField('isFeatured', val)} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">New Arrival</p>
                  <p className="text-xs text-muted-foreground">Show in new arrivals section</p>
                </div>
                <Switch checked={form.isNewArrival} onCheckedChange={val => setField('isNewArrival', val)} />
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-muted/30">
            <CardHeader><CardTitle className="text-sm">Summary</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sizes selected</span>
                <span className="font-medium">{enabledCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total stock</span>
                <span className="font-medium">{totalStock} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Colors</span>
                <span className="font-medium">{colors.filter(c => c.name).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Images</span>
                <span className="font-medium">{existingImages.length + imageFiles.length}</span>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" disabled={saving}>
            {saving ? 'Saving...' : product?._id ? 'Update Product' : 'Create Product'}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={() => router.push('/admin/products')}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
