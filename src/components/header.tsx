'use client';

import Link from 'next/link';
import { Book, BookMarked } from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { UserAuthButton } from '@/components/user-auth-button';

export function Header() {
  const { user } = useAuth();

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
        <div className="flex items-center gap-2">
          {user && (
            <Button asChild variant="ghost">
              <Link href="/library">
                <BookMarked />
                <span className="hidden md:inline ml-2">My Library</span>
              </Link>
            </Button>
          )}
          <UserAuthButton />
        </div>
      </div>
    </header>
  );
}
