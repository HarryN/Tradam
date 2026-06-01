"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/context/auth-context';
import { ShoppingBag, Store, ArrowRight } from 'lucide-react';

export default function Header() {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-border backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shadow-sm">T</div>
          <span className="text-xl font-bold tracking-tight text-neutral-text">Trada<span className="text-primary">m</span></span>
        </div>

        {profile?.role !== 'seller' && (
          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium text-neutral-muted hover:text-primary transition-colors">Marketplace</Link>
            <Link href="/cart" className="text-sm font-medium text-neutral-muted hover:text-primary transition-colors">Cart</Link>
            <Link href="/orders" className="text-sm font-medium text-neutral-muted hover:text-primary transition-colors">Orders</Link>
          </div>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {profile?.role === 'seller' ? (
                <Link href="/sellers/dashboard" className="text-sm font-semibold text-primary px-3 py-2 hover:underline transition-all">Dashboard</Link>
              ) : (
                <span className="text-sm text-neutral-muted px-3 py-2 truncate max-w-[150px]">{user.email}</span>
              )}
              <button onClick={() => signOut()} className="text-sm font-semibold border border-neutral-border text-neutral-text hover:bg-neutral-bg px-4 py-2 rounded-lg transition-all cursor-pointer">Log Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-semibold text-neutral-text hover:text-primary px-4 py-2 transition-colors">Log In</Link>
              <Link href="/auth/signup" className="text-sm font-semibold bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-all shadow-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
