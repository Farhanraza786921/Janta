'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { Header } from '@/components/header';
import { BookCard } from '@/components/book-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { BookHeart, Frown, LogIn } from 'lucide-react';

type Book = {
  id: number;
  title: string;
  authors: { name: string }[];
  formats: { [key: string]: string };
};

export default function LibraryPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsLoading(false);
      setSavedBooks([]);
      return;
    }

    const fetchBooks = async () => {
      if (!db || !user) return;
      setIsLoading(true);
      try {
        const q = query(collection(db, 'users', user.uid, 'savedBooks'));
        const querySnapshot = await getDocs(q);
        const books = querySnapshot.docs.map(doc => doc.data() as Book);
        setSavedBooks(books);
      } catch (error) {
        console.error("Error fetching saved books: ", error);
        // Optionally, add a toast here
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [user, authLoading]);

  const renderContent = () => {
    if (authLoading || isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-64 w-full" />
              </CardContent>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <Frown className="w-16 h-16 text-muted-foreground" />
          <h3 className="text-2xl font-bold">Please log in</h3>
          <p className="text-muted-foreground">You need to be logged in to view your library.</p>
          <Button onClick={signInWithGoogle}>
            <LogIn className="mr-2 h-4 w-4" />
            Login with Google
          </Button>
        </div>
      );
    }

    if (savedBooks.length === 0) {
      return (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <BookHeart className="w-16 h-16 text-muted-foreground" />
          <h3 className="text-2xl font-bold">Your library is empty</h3>
          <p className="text-muted-foreground">Start exploring and save books you like!</p>
          <Button asChild>
            <Link href="/">Explore Books</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {savedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-12 md:py-20">
          <h2 className="text-4xl md:text-5xl font-bold font-headline mb-12 text-center">
            My Library
          </h2>
          {renderContent()}
        </section>
      </main>
      <footer className="bg-card text-center p-6 mt-12">
        <p className="text-muted-foreground">
          Your personal collection of timeless stories.
        </p>
      </footer>
    </div>
  );
}
