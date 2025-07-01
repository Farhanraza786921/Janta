'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/profile');
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-sm w-full">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold font-headline">Welcome Back</CardTitle>
                <CardDescription>Please sign in to access your profile and library.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={signInWithGoogle} size="lg" className="w-full" disabled={loading}>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign in with Google
                </Button>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
