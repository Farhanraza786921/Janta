'use client';

import Link from 'next/link';
import { Book } from 'lucide-react';

export function Header() {
  return (
    <header className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-md">
              <Book className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-foreground">
              Janta Reader
            </h1>
          </Link>
        </div>
      </div>
    </header>
  );
}
