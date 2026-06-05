'use client';

import React, { useState } from 'react';
import { Star, Loader2, Send } from 'lucide-react';
import { submitReview } from '@/services/rating-service';

interface ReviewFormProps {
  productId: string;
  order_id: string;
  buyerId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, order_id, buyerId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitReview({
        product_id: productId,
        order_id: order_id,
        buyer_id: buyerId,
        rating,
        comment: comment.trim() || undefined
      });
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
        <p className="text-sm font-bold text-emerald-700">Thank you for your review!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-neutral-bg/50 p-4 rounded-2xl border border-neutral-border">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-muted">Rate this product</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(s)}
              className="p-1 transition-transform active:scale-90"
            >
              <Star 
                className={`w-6 h-6 transition-colors ${
                  (hovered || rating) >= s ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                }`} 
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-muted">Comment (Optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          className="w-full px-4 py-3 rounded-xl border border-neutral-border bg-white text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none h-24"
        />
      </div>

      {error && <p className="text-xs font-bold text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Submit Review
      </button>
    </form>
  );
}
