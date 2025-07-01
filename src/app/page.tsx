'use client';

import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Loader2, Search, Sparkles } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BookCard } from '@/components/book-card';
import { getRecommendationsAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';

type Book = {
  id: number;
  title: string;
  authors: { name: string }[];
  formats: { [key: string]: string };
};

type GutendexResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
};

const recommendationSchema = z.object({
  readingHistory: z.string().min(10, 'Please tell us about a few books you\'ve read to get recommendations.'),
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isRecsLoading, setIsRecsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof recommendationSchema>>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      readingHistory: '',
    },
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    setIsSearchLoading(true);
    setSearchResults([]);
    try {
      const response = await fetch(`https://gutendex.com/books?search=${encodeURIComponent(searchQuery)}`);
      const data: GutendexResponse = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: 'Could not fetch books from the library. Please try again later.',
      });
      console.error('Search failed:', error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const onGetRecommendations = async (values: z.infer<typeof recommendationSchema>) => {
    setIsRecsLoading(true);
    setRecommendations([]);
    try {
      const result = await getRecommendationsAction(values.readingHistory);
      if (result.success && result.titles) {
        const bookPromises = result.titles.map((title) =>
          fetch(`https://gutendex.com/books?search=${encodeURIComponent(title)}`).then((res) => res.json())
        );
        const bookResults = await Promise.all(bookPromises);
        const recommendedBooks = bookResults.map((res: GutendexResponse) => res.results[0]).filter(Boolean);
        setRecommendations(recommendedBooks);
        if(recommendedBooks.length === 0) {
            toast({
                title: "AI couldn't find exact matches",
                description: "Try refining your reading history for better recommendations."
            })
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Recommendation Failed',
        description: 'Could not get recommendations. Please try again.',
      });
      console.error('Recommendation failed:', error);
    } finally {
      setIsRecsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <section
          id="search"
          className="container mx-auto px-4 py-12 md:py-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            Find Your Next Adventure.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore a universe of free, public domain books. Your journey begins with a single search.
          </p>
          <form
            onSubmit={handleSearch}
            className="flex max-w-xl mx-auto gap-2"
          >
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="text-base"
              aria-label="Book search"
            />
            <Button type="submit" size="lg" disabled={isSearchLoading}>
              {isSearchLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Search />
              )}
              <span className="hidden md:inline ml-2">Search</span>
            </Button>
          </form>
        </section>

        {(isSearchLoading || searchResults.length > 0) && (
          <section id="results" className="container mx-auto px-4 py-12">
            <h3 className="text-3xl font-headline font-bold mb-8 text-center">
              Search Results
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isSearchLoading
                ? Array.from({ length: 8 }).map((_, i) => (
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
                  ))
                : searchResults.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
            </div>
          </section>
        )}

        {!isSearchLoading && searchResults.length === 0 && (
          <div className="container mx-auto px-4 pb-12 pt-4">
            <div className="relative mx-auto h-32 max-w-2xl md:h-48">
              <Image
                 src="/padh.png"
                 alt="Padhai Kar Lo"
                 fill
                 className="rounded-xl object-contain"
                 sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 640px"
              />
            </div>
          </div>
        )}

        <section
          id="recommendations"
          className="bg-card py-16 md:py-24"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-4 mb-4">
               <Sparkles className="h-8 w-8 text-accent" />
               <h3 className="text-3xl md:text-4xl font-headline font-bold text-center">
                 AI Book-o-mancer
               </h3>
            </div>
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              Tell our AI what you've enjoyed reading, and let it conjure up some personalized recommendations for you.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onGetRecommendations)}
                className="max-w-xl mx-auto space-y-4"
              >
                <FormField
                  control={form.control}
                  name="readingHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Your Reading History</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'I loved the adventure in The Hobbit, the philosophy in The Alchemist, and the mystery in And Then There Were None...'"
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" size="lg" disabled={isRecsLoading}>
                  {isRecsLoading ? <Loader2 className="animate-spin" /> : <Bot />}
                  <span className="ml-2">Get Recommendations</span>
                </Button>
              </form>
            </Form>
            
            {(isRecsLoading || recommendations.length > 0) && (
              <div className="mt-16">
                 <h4 className="text-2xl font-headline font-bold mb-8 text-center">
                   Your AI-Curated Shelf
                 </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {isRecsLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
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
                      ))
                    : recommendations.map((book) => (
                        <BookCard key={book.id} book={book} />
                      ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="text-center p-6">
        <p className="text-muted-foreground text-sm">
          Powered by FARHAN
        </p>
      </footer>
    </div>
  );
}
