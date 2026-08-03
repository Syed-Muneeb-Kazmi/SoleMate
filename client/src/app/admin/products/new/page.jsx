'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AdminProductForm from '@/components/admin/AdminProductForm';
import { categoriesAPI } from '@/lib/api';

export default function NewProductPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoriesAPI.getAll().then(res => setCategories(res.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products"><ChevronLeft size={16} /> Back to Products</Link>
        </Button>
      </div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Add New Product</h1>
        <p className="text-sm text-muted-foreground">Fill in the details below to create a new product listing.</p>
      </div>
      <AdminProductForm categories={categories} />
    </div>
  );
}
