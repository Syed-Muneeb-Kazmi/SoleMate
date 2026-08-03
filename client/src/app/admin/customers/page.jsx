'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Users, Search, Mail, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usersAPI } from '@/lib/api';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await usersAPI.getAll({ limit: 100 });
        setCustomers(res.data || []);
      } catch (e) { toast.error('Failed to load customers'); }
      finally { setLoading(false); }
    };
    fetchCustomers();
  }, []);

  const filtered = search
    ? customers.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()))
    : customers;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground">{customers.length} registered users</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Users size={40} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No customers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((customer) => (
                    <tr key={customer._id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
                            {customer.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{customer.email}</td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{customer.phone || '—'}</td>
                      <td className="py-3 px-4">
                        <Badge variant={customer.role === 'admin' ? 'default' : 'secondary'} className="text-xs capitalize">
                          {customer.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
