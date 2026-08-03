'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Warehouse, AlertTriangle, CheckCircle, Search, Edit2, Plus, Minus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { productsAPI } from '@/lib/api';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [editSizes, setEditSizes] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsAPI.getAll({ limit: 200 });
      setProducts(res.data || []);
    } catch (e) { toast.error('Failed to load inventory'); }
    finally { setLoading(false); }
  };

  const openEdit = (product) => {
    setEditProduct(product);
    // Deep clone sizes so we can edit locally
    setEditSizes((product.sizes || []).map(s => ({ ...s })));
  };

  const updateSizeStock = (idx, delta) => {
    setEditSizes(prev => prev.map((s, i) => i === idx ? { ...s, stock: Math.max(0, s.stock + delta) } : s));
  };

  const setSizeStockDirect = (idx, val) => {
    const num = parseInt(val);
    setEditSizes(prev => prev.map((s, i) => i === idx ? { ...s, stock: isNaN(num) ? 0 : Math.max(0, num) } : s));
  };

  const handleSaveStock = async () => {
    if (!editProduct) return;
    setSaving(true);
    try {
      await productsAPI.update(editProduct._id, { sizes: editSizes });
      toast.success('Stock updated successfully');
      setEditProduct(null);
      fetchProducts();
    } catch (e) {
      toast.error(e.message || 'Failed to update stock');
    } finally {
      setSaving(false);
    }
  };

  const inventoryData = products.map(p => {
    const totalStock = p.sizes?.reduce((sum, s) => sum + s.stock, 0) || 0;
    const maxCapacity = Math.max(p.sizes?.length * 20 || 100, 1);
    return { ...p, totalStock, maxCapacity };
  });

  const lowStock = inventoryData.filter(p => p.totalStock > 0 && p.totalStock <= 10);
  const outOfStock = inventoryData.filter(p => p.totalStock === 0);
  const healthy = inventoryData.filter(p => p.totalStock > 10);

  const filtered = search
    ? inventoryData.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()))
    : inventoryData;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Inventory</h1>
        <p className="text-sm text-muted-foreground">Monitor and update stock levels for all products</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Healthy Stock</p>
                <p className="font-heading text-2xl font-bold text-emerald-600">{healthy.length}</p>
              </div>
              <CheckCircle size={24} className="text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="font-heading text-2xl font-bold text-amber-600">{lowStock.length}</p>
              </div>
              <AlertTriangle size={24} className="text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="font-heading text-2xl font-bold text-red-600">{outOfStock.length}</p>
              </div>
              <Warehouse size={24} className="text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      {/* Inventory list */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Warehouse size={40} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.sort((a, b) => a.totalStock - b.totalStock).map((product) => {
                const stockPercent = Math.min(100, (product.totalStock / product.maxCapacity) * 100);
                const isLow = product.totalStock <= 10 && product.totalStock > 0;
                const isOut = product.totalStock === 0;

                return (
                  <div key={product._id} className="p-4 hover:bg-muted/20">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          {isOut ? (
                            <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                          ) : isLow ? (
                            <Badge className="bg-amber-100 text-amber-800 text-xs border-0">Low Stock</Badge>
                          ) : (
                            <Badge className="bg-emerald-100 text-emerald-800 text-xs border-0">In Stock</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{product.brand} · {product.gender}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-bold">{product.totalStock} units</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(product)}
                          className="h-8 px-3"
                        >
                          <Edit2 size={13} className="mr-1" /> Update Stock
                        </Button>
                      </div>
                    </div>
                    <Progress value={stockPercent} className="h-2 mb-2" />
                    {/* Per-size breakdown */}
                    {product.sizes?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {product.sizes.map(s => (
                          <span
                            key={s.size}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              s.stock === 0 ? 'bg-red-100 text-red-700' :
                              s.stock <= 5 ? 'bg-amber-100 text-amber-700' :
                              'bg-muted text-muted-foreground'
                            }`}
                          >
                            US {s.size}: {s.stock}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Update Dialog */}
      <Dialog open={!!editProduct} onOpenChange={(open) => { if (!open) setEditProduct(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Stock — {editProduct?.name}</DialogTitle>
            <DialogDescription>Adjust the stock quantity for each size. Click +/− or type a value directly.</DialogDescription>
          </DialogHeader>
          <div className="py-2 max-h-80 overflow-y-auto">
            {editSizes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No sizes configured. Edit the product to add sizes first.
              </p>
            ) : (
              <div className="space-y-3">
                {editSizes.map((s, idx) => (
                  <div key={s.size} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-semibold">US {s.size}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.stock === 0 ? 'Out of stock' : s.stock <= 5 ? 'Low stock' : 'In stock'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateSizeStock(idx, -1)}
                        className="w-8 h-8 rounded-full border border-border bg-background hover:bg-muted flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <Input
                        type="number"
                        min="0"
                        value={s.stock}
                        onChange={e => setSizeStockDirect(idx, e.target.value)}
                        className="w-20 h-8 text-center text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => updateSizeStock(idx, 1)}
                        className="w-8 h-8 rounded-full border border-border bg-background hover:bg-muted flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Total: <strong>{editSizes.reduce((sum, s) => sum + (parseInt(s.stock) || 0), 0)} units</strong>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
              <Button onClick={handleSaveStock} disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {saving ? 'Saving...' : 'Save Stock'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
