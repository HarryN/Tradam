'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/features/auth/context/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (profile && profile.role !== 'seller') {
        // If logged in but not a seller, redirect to main landing page
        router.push('/');
      }
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-neutral-bg">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm text-neutral-muted font-medium">Verifying store access...</p>
      </div>
    );
  }

  if (!user || (profile && profile.role !== 'seller')) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-neutral-bg px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-neutral-text">Access Denied</h3>
        <p className="mt-2 text-sm text-neutral-muted max-w-sm">
          You must be logged in as a registered Seller to access the vendor portal dashboard.
        </p>
        <div className="mt-6 flex gap-4">
          <Link 
            href="/auth/login" 
            className="text-sm font-semibold bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors"
          >
            Log In
          </Link>
          <Link 
            href="/" 
            className="text-sm font-semibold bg-white border border-neutral-border text-neutral-text hover:bg-neutral-bg px-4 py-2 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
