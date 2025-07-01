'use client';

import Link from 'next/link';
import { Book, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-auto flex">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-md">
              <Book className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold font-headline text-lg tracking-wide">
              Janta Library
            </span>
          </Link>
        </div>
        <nav className="flex items-center gap-2">
          <Button asChild variant="destructive" size="sm">
            <Link href="/donate" className="font-semibold">
              Donate <Heart className="ml-1 h-4 w-4 fill-current" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
