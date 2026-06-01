"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/context/auth-context';
import { ShoppingBag, Store, ArrowRight, LogOut, User } from 'lucide-react';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);

  const handleLogout = async () => {
    setAccountOpen(false);
    await signOut();
  };

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
                /* Buyer Account Card */
                <div className="relative">
                  <button
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-bg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-bold text-neutral-text leading-none">Buyer</p>
                      <p className="text-[10px] text-neutral-muted truncate max-w-[120px]">{user.email}</p>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-border rounded-2xl shadow-lg overflow-hidden">
                      <div className="p-4 bg-neutral-bg/50 border-b border-neutral-border">
                        <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Account</p>
                        <p className="text-sm font-semibold text-neutral-text mt-1">{user.email}</p>
                        <p className="text-xs text-neutral-muted mt-1">Role: <span className="font-semibold text-primary">Buyer</span></p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold group"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
              {profile?.role === 'seller' && (
                <button onClick={() => signOut()} className="text-sm font-semibold border border-neutral-border text-neutral-text hover:bg-neutral-bg px-4 py-2 rounded-lg transition-all cursor-pointer">Log Out</button>
              )}
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
