'use client';

import Link from 'next/link';
import { Book, User, Heart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                English (EN)
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              <DropdownMenuItem>English (EN)</DropdownMenuItem>
              <DropdownMenuItem disabled>Español (ES)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild variant="destructive" size="sm">
            <a
              href="https://coff.ee/Heart786"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
            >
              Donate <Heart className="ml-1 h-4 w-4 fill-current" />
            </a>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>My Library</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log In</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
