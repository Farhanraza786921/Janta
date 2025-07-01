'use client';

import Image from 'next/image';
import { BookOpen, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useConfetti } from '@/providers/confetti-provider';

type Book = {
  id: number;
  title: string;
  authors: { name: string }[];
  formats: { [key: string]: string };
};

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const confetti = useConfetti();

  const author = book.authors[0]?.name || 'Unknown Author';
  const coverUrl = book.formats['image/jpeg'];
  const readUrl = book.formats['text/html'] || book.formats['text/html; charset=utf-8'];
  const downloadUrl = book.formats['application/epub+zip'] || book.formats['application/pdf'];

  const handleDownload = () => {
    confetti.onOpen();
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-0 flex-shrink-0">
        <div className="aspect-[2/3] w-full relative bg-secondary">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint="book cover"
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
      <CardHeader className="flex-grow">
        <CardTitle className="font-headline text-lg leading-tight">
          {book.title}
        </CardTitle>
        <CardDescription className="font-body">{author}</CardDescription>
      </CardHeader>
      <CardFooter className="flex-col sm:flex-row gap-2">
        {readUrl && (
          <Button asChild variant="secondary" className="w-full">
            <a href={readUrl} target="_blank" rel="noopener noreferrer">
              <BookOpen />
              Read Online
            </a>
          </Button>
        )}
        {downloadUrl && (
          <Button onClick={handleDownload} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Download />
            Download
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
