'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { productsAPI } from '@/lib/api';
import { getImageUrl, formatCurrency } from '@/lib/utils';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsAPI.getAll({ limit: 200 });
      setProducts(res.data || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await productsAPI.delete(selectedProduct._id);
      toast.success('Product deleted');
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (e) { toast.error(e.message || 'Delete failed'); }
  };

  const filtered = search
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand?.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} total products</p>
        </div>
        <Button
          onClick={() => router.push('/admin/products/new')}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          id="add-product-btn"
        >
          <Plus size={16} className="mr-2" /> Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or brand..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
            id="admin-product-search"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Package size={40} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Sizes</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => {
                    const totalStock = product.sizes?.reduce((sum, s) => sum + s.stock, 0) || 0;
                    return (
                      <tr key={product._id} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                              <Image src={getImageUrl(product.images?.[0])} alt="" width={40} height={40} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                          {product.category?.name || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold">{formatCurrency(product.price)}</span>
                          {product.compareAtPrice > 0 && (
                            <span className="text-xs text-muted-foreground line-through ml-1">{formatCurrency(product.compareAtPrice)}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <span className={totalStock <= 10 ? 'text-destructive font-medium' : ''}>
                            {totalStock}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">
                          {product.sizes?.length || 0} sizes
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <div className="flex gap-1">
                            {product.isFeatured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                            {product.isNewArrival && <Badge className="bg-accent/10 text-accent text-xs border-0">New</Badge>}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/admin/products/${product._id}/edit`)}>
                                <Edit size={14} className="mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/product/${product.slug || product._id}`} target="_blank">
                                  <Eye size={14} className="mr-2" /> View on Store
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => { setSelectedProduct(product); setDeleteDialogOpen(true); }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 size={14} className="mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedProduct?.name}&quot;? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
