import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-heading text-8xl font-bold text-accent mb-4">404</h1>
        <h2 className="font-heading text-2xl font-bold mb-2">Lost Your Sole?</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you&apos;re looking for has walked away. Let us help you find your way back.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">Shop Shoes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
