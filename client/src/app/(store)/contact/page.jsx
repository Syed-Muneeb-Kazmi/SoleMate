'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import ScrollReveal from '@/components/store/ScrollReveal';
import { contactAPI } from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all fields'); return;
    }
    setLoading(true);
    try {
      await contactAPI.submit(form);
      toast.success('Message sent!', { description: "We'll get back to you soon." });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <ScrollReveal>
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold mb-3">Get in <span className="text-accent">Touch</span></h1>
          <p className="text-muted-foreground max-w-md mx-auto">Have a question? We&apos;d love to hear from you.</p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="md:col-span-2">
          <ScrollReveal>
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" className="mt-1.5" required id="contact-name" /></div>
                    <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" className="mt-1.5" required id="contact-email" /></div>
                  </div>
                  <div><Label>Subject</Label><Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="How can we help?" className="mt-1.5" required id="contact-subject" /></div>
                  <div><Label>Message</Label><Textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell us more..." rows={5} className="mt-1.5" required id="contact-message" /></div>
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading} id="contact-submit">
                    <Send size={16} className="mr-2" /> {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        <div className="space-y-4">
          {[
            { icon: MapPin, title: 'Visit Us', lines: ['123 Fashion Street', 'New York, NY 10001'] },
            { icon: Phone, title: 'Call Us', lines: ['(555) 123-4567', 'Mon–Fri 9am–6pm'] },
            { icon: Mail, title: 'Email Us', lines: ['hello@solemate.com', 'support@solemate.com'] },
          ].map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <Card>
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    {item.lines.map(l => <p key={l} className="text-xs text-muted-foreground">{l}</p>)}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
