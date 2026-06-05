'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/auth-context';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';
import { 
  Star, 
  MessageSquare, 
  Package, 
  Store, 
  Calendar,
  AlertCircle,
  Loader2,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

export default function BuyerReviewsPage() {
  const { t } = useLanguage();
  const { tc } = useTranslatedContent();
  const { user } = useAuth();
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadReviews = async () => {
      try {
        const { data, error: revError } = await supabase
          .from('product_reviews')
          .select(`
            *,
            products (title, image_url, seller_id)
          `)
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false });

        if (revError) throw revError;
        setReviews(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm font-bold text-neutral-muted uppercase tracking-widest">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-neutral-text tracking-tight flex items-center gap-4">
          <Star className="w-8 h-8 text-primary" />
          My Reviews
        </h1>
        <p className="mt-2 text-sm text-neutral-muted font-medium">
          A history of all feedback and ratings you've shared with sellers.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-border p-20 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 bg-neutral-bg rounded-full flex items-center justify-center mx-auto text-neutral-muted">
            <MessageSquare className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-text">No reviews yet</h2>
            <p className="mt-2 text-sm text-neutral-muted max-w-xs mx-auto">
              You haven't left any reviews yet. Share your experience with sellers after receiving your orders!
            </p>
          </div>
          <Link href="/buyers/orders" className="inline-flex px-8 py-3 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary-hover transition-all">
            Go to My Orders
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-3xl border border-neutral-border shadow-sm overflow-hidden group hover:border-primary/30 transition-all p-6 sm:p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Review Content */}
                <div className="flex-1 space-y-6">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-5 h-5 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} 
                      />
                    ))}
                    <span className="ml-2 text-sm font-black text-neutral-text">{review.rating}.0</span>
                  </div>

                  {/* Comment */}
                  <blockquote className="text-lg font-medium text-neutral-text leading-relaxed italic text-balance">
                    "{review.comment || 'No comment provided.'}"
                  </blockquote>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-6 pt-2 text-[10px] font-black text-neutral-muted uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary/40" />
                      Submitted on {new Date(review.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-primary/40" />
                      Order Verified
                    </div>
                  </div>
                </div>

                {/* Right: Product Context */}
                <div className="w-full md:w-64 shrink-0 bg-neutral-bg/50 rounded-2xl p-5 border border-neutral-border/50">
                  <p className="text-[10px] font-black text-neutral-muted uppercase tracking-widest mb-3">Product Feedback</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-neutral-border overflow-hidden shrink-0">
                      {review.products?.image_url ? (
                        <img src={review.products.image_url} alt={review.products.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-text truncate leading-tight mb-1">{tc(review.products?.title)}</p>
                      <Link 
                        href={`/products/${review.product_id}`}
                        className="text-[10px] font-black text-primary hover:underline flex items-center gap-1"
                      >
                        Re-order Item <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
