'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight, UserCheck, Store } from 'lucide-react';
import { UserRole } from '@/types';

export default function SignupPage() {
  const { signUp, user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      if (profile?.role === 'seller') {
        router.push('/sellers/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user, profile, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signUpError } = await signUp(email, password, role);

    if (signUpError) {
      setError(signUpError.message || 'Failed to register account');
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-bg">
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-neutral-border shadow-xs text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-text">
            Verify Your Email
          </h2>
          <p className="mt-4 text-sm text-neutral-muted leading-relaxed">
            We have sent a verification link to <span className="font-semibold text-neutral-text">{email}</span>. 
            Please check your inbox (and spam folder) to complete registration.
          </p>
          <div className="mt-8">
            <Link 
              href="/auth/login" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Go to Login page
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-bg">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-neutral-border shadow-xs">
        
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <span className="text-lg font-bold tracking-tight text-neutral-text">
              Tradam
            </span>
          </Link>
          
          <h2 className="text-3xl font-extrabold text-neutral-text tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-neutral-muted">
            Register as a buyer or vendor on Tradam
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-4 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
              Choose Your Account Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setRole('buyer')}
                className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  role === 'buyer'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-neutral-border bg-white text-neutral-muted hover:border-neutral-text hover:text-neutral-text'
                }`}
              >
                <UserCheck className="w-6 h-6 mb-2" />
                <span className="text-sm font-semibold">Buyer</span>
                <span className="text-[10px] text-center mt-1">Browse and shop products</span>
              </div>

              <div 
                onClick={() => setRole('seller')}
                className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  role === 'seller'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-neutral-border bg-white text-neutral-muted hover:border-neutral-text hover:text-neutral-text'
                }`}
              >
                <Store className="w-6 h-6 mb-2" />
                <span className="text-sm font-semibold">Seller</span>
                <span className="text-[10px] text-center mt-1">Upload & manage storefront</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-border bg-white text-sm text-neutral-text placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <Mail className="w-4 h-4 text-neutral-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-border bg-white text-sm text-neutral-text placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <Lock className="w-4 h-4 text-neutral-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-border bg-white text-sm text-neutral-text placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <Lock className="w-4 h-4 text-neutral-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white py-3 rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Register
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs">
          <span className="text-neutral-muted">Already have an account? </span>
          <Link href="/auth/login" className="font-semibold text-primary hover:text-primary-hover">
            Login instead
          </Link>
        </div>
      </div>
    </div>
  );
}
