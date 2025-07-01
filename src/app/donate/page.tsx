import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function DonatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline font-bold">Support Janta Library</CardTitle>
            <CardDescription>
              Your generosity helps keep this digital library alive and thriving for everyone. Every cup of coffee fuels our mission to make knowledge accessible to all.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
              <Image
                src="https://placehold.co/600x338.png"
                alt="A supporter of the Janta Library"
                fill
                className="object-cover"
                sizes="(max-width: 440px) 100vw, 440px"
                data-ai-hint="man doctor"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Click the button to support me ❤️
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
              <a href="https://coff.ee/Heart786" target="_blank" rel="noopener noreferrer">
                Donate Now
              </a>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <footer className="text-center p-6 bg-card">
        <p className="text-muted-foreground text-sm">
          Powered by FARHAN
        </p>
      </footer>
    </div>
  );
}
