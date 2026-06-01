'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/context/auth-context';
import { addProductToCart } from '@/services/cart-service';
import { useRouter } from 'next/navigation';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!user) {
      setMessage('Please log in to add items to your cart.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await addProductToCart(user.id, productId, 1);
      setMessage('Added to cart.');
      setTimeout(() => setMessage(null), 2500);
      router.refresh();
    } catch (error: any) {
      setMessage(error?.message || 'Could not add to cart.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading}
        className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-60"
      >
        <ShoppingCart className="w-4 h-4" />
        {loading ? 'Adding…' : 'Add to Cart'}
      </button>
      {message && (
        <div className="text-sm text-white bg-neutral-text/80 rounded-xl px-3 py-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
