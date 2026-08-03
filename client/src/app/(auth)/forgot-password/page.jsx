'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { authAPI } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-heading text-3xl font-bold">Sole<span className="text-accent">Mate</span></Link>
          <p className="text-muted-foreground mt-2">Reset your password</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-6">
            {sent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Mail size={28} className="text-success" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">Check your email</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  We&apos;ve sent a password reset link to <strong>{email}</strong>
                </p>
                <Button variant="outline" asChild><Link href="/login"><ArrowLeft size={16} className="mr-2" /> Back to Login</Link></Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-muted-foreground">Enter your email and we&apos;ll send you a link to reset your password.</p>
                <div>
                  <Label htmlFor="forgot-email">Email</Label>
                  <div className="relative mt-1.5">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input id="forgot-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <p className="text-center text-sm"><Link href="/login" className="text-accent hover:underline">Back to Login</Link></p>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
