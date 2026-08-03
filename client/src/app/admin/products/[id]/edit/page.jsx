'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AdminProductForm from '@/components/admin/AdminProductForm';
import { productsAPI, categoriesAPI } from '@/lib/api';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productsAPI.getById(id),
      categoriesAPI.getAll(),
    ]).then(([prodRes, catRes]) => {
      setProduct(prodRes.data);
      setCategories(catRes.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Product not found.</p>
        <Button asChild><Link href="/admin/products">Back to Products</Link></Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products"><ChevronLeft size={16} /> Back to Products</Link>
        </Button>
      </div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Edit Product</h1>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>
      <AdminProductForm product={product} categories={categories} />
    </div>
  );
}
