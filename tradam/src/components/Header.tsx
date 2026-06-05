"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/context/auth-context';
import { useLanguage } from '@/hooks/useLanguage';
import { ShoppingBag, Store, ArrowRight, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const { locale, setLanguage, languages, t } = useLanguage();
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

        {/* Middle Navigation - Cleaned up to avoid duplicates */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium text-neutral-muted hover:text-primary transition-colors">{t('marketplace')}</Link>
          
          {user && profile?.role === 'seller' && (
            <>
              <Link href="/sellers/products" className="text-sm font-medium text-neutral-muted hover:text-primary transition-colors">{t('myProducts')}</Link>
              <Link href="/sellers/orders" className="text-sm font-medium text-neutral-muted hover:text-primary transition-colors">{t('orders')}</Link>
            </>
          )}

          {user && profile?.role === 'buyer' && (
            <>
              <Link href="/buyers/cart" className="text-sm font-medium text-neutral-muted hover:text-primary transition-colors">{t('cart')}</Link>
              <Link href="/buyers/orders" className="text-sm font-medium text-neutral-muted hover:text-primary transition-colors">{t('orders')}</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 rounded-full border border-neutral-border bg-neutral-bg px-2 py-1 text-[11px] font-semibold text-neutral-text">
            <span className="hidden sm:inline">{t('language')}:</span>
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => setLanguage(language.code)}
                className={`px-2 py-1 rounded-full transition-colors ${locale === language.code ? 'bg-primary text-white' : 'text-neutral-text hover:bg-neutral-border'}`}
              >
                {language.label}
              </button>
            ))}
          </div>

          {user ? (
            <>
              {/* Dashboard Link - Unified Style */}
              {profile?.role === 'seller' ? (
                <div className="flex items-center gap-3">
                  <Link href="/sellers/dashboard" className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-all uppercase tracking-wider">
                    {t('dashboard')}
                  </Link>
                  <button 
                    onClick={() => signOut()} 
                    className="text-xs font-bold border border-neutral-border text-neutral-text hover:bg-neutral-bg px-3 py-1.5 rounded-lg transition-all cursor-pointer uppercase tracking-wider"
                  >
                    {t('signOut')}
                  </button>
                </div>
              ) : (
                /* Buyer Account Dropdown */
                <div className="relative">
                  <button
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-bg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-bold text-neutral-text leading-none">{t('buyer')}</p>
                      <p className="text-[10px] text-neutral-muted truncate max-w-[120px]">{user.email}</p>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-border rounded-2xl shadow-lg overflow-hidden">
                      <div className="p-4 bg-neutral-bg/50 border-b border-neutral-border">
                        <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">{t('account')}</p>
                        <p className="text-sm font-semibold text-neutral-text mt-1">{user.email}</p>
                        <p className="text-xs text-neutral-muted mt-1">{t('role')}: <span className="font-semibold text-primary">{t('buyer')}</span></p>
                      </div>
                      <Link 
                        href="/buyers/dashboard" 
                        onClick={() => setAccountOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-neutral-text hover:bg-neutral-bg transition-colors text-sm font-semibold border-b border-neutral-border"
                      >
                        <LayoutDashboard className="w-4 h-4 text-neutral-muted" />
                        {t('dashboard')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold group"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('signOut')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Guest Auth Links */
            <>
              <Link href="/auth/login" className="text-sm font-semibold text-neutral-text hover:text-primary px-4 py-2 transition-colors">{t('logIn')}</Link>
              <Link href="/auth/signup" className="text-sm font-semibold bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-all shadow-sm">{t('getStarted')}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
