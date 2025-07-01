'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Loader2, User, CalendarDays } from 'lucide-react';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
            <div className="flex flex-col items-center gap-4 w-full max-w-md">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="space-y-2 w-full">
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                    <Skeleton className="h-12 w-full mt-4" />
                </div>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center items-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
                {user.photoURL ? (
                    <Image
                        src={user.photoURL}
                        alt={user.displayName || 'Profile Picture'}
                        className="rounded-full"
                        fill
                        sizes="96px"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                )}
            </div>
            <CardTitle className="font-headline text-3xl">{user.displayName}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2 text-sm p-4 bg-muted/50 rounded-lg">
                <span className="font-semibold text-muted-foreground">User ID</span>
                <span className="font-mono text-xs break-all">{user.uid}</span>
            </div>
             {user.metadata.creationTime && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4" />
                    <span>Joined on {new Date(user.metadata.creationTime).toLocaleDateString()}</span>
                </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={signOut} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
