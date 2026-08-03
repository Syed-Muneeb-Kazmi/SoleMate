'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, FolderOpen, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categoriesAPI } from '@/lib/api';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', parent: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data || []);
    } catch (e) { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setSelected(null);
    setForm({ name: '', description: '', parent: '' });
    setDialogOpen(true);
  };

  const openEdit = (cat) => {
    setSelected(cat);
    setForm({ name: cat.name, description: cat.description || '', parent: cat.parent?._id || cat.parent || '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const body = { name: form.name, description: form.description };
      if (form.parent) body.parent = form.parent;
      if (selected) {
        await categoriesAPI.update(selected._id, body);
        toast.success('Category updated');
      } else {
        await categoriesAPI.create(body);
        toast.success('Category created');
      }
      setDialogOpen(false);
      fetchCategories();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await categoriesAPI.delete(selected._id);
      toast.success('Category deleted');
      setDeleteDialogOpen(false);
      fetchCategories();
    } catch (e) { toast.error(e.message); }
  };

  const topLevel = categories.filter(c => !c.parent);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">{categories.length} total</p>
        </div>
        <Button onClick={openCreate} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus size={16} className="mr-2" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => <Card key={i}><CardContent className="p-6 h-32 animate-pulse bg-muted" /></Card>)
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FolderOpen size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No categories yet</p>
          </div>
        ) : (
          categories.map((cat) => {
            const children = categories.filter(c => (c.parent?._id || c.parent) === cat._id);
            return (
              <Card key={cat._id} className="hover:border-accent/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{cat.name}</h3>
                      {cat.parent && (
                        <p className="text-xs text-muted-foreground">
                          Sub of: {categories.find(c => c._id === (cat.parent?._id || cat.parent))?.name || 'Parent'}
                        </p>
                      )}
                      {cat.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
                      )}
                      {children.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {children.map(ch => (
                            <Badge key={ch._id} variant="secondary" className="text-xs">{ch.name}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(cat)}><Edit size={14} className="mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelected(cat); setDeleteDialogOpen(true); }} className="text-destructive">
                          <Trash2 size={14} className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>Enter category details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1.5" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="mt-1.5" /></div>
            <div>
              <Label>Parent Category</Label>
              {/* Native select avoids shadcn value-matching issues with MongoDB ObjectIds */}
              <select
                value={form.parent || ''}
                onChange={e => setForm({...form, parent: e.target.value})}
                className="mt-1.5 w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">None (top-level)</option>
                {topLevel.filter(c => c._id !== selected?._id).map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {saving ? 'Saving...' : selected ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>Delete &quot;{selected?.name}&quot;? This cannot be undone.</DialogDescription>
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
