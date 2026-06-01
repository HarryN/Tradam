'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/auth-context';
import { getCartItems } from '@/services/cart-service';
import { createOrderFromCart } from '@/services/order-service';
import { CartItem } from '@/types';

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadCart = async () => {
      setError(null);
      try {
        const cartItems = await getCartItems(user.id);
        setItems(cartItems);
      } catch (err: any) {
        setError(err?.message || 'Unable to load your cart.');
      }
    };

    loadCart();
  }, [user]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);
  }, [items]);

  const handlePlaceOrder = async () => {
    if (!user) return;
    setBusy(true);
    setError(null);

    try {
      await createOrderFromCart(user.id, items);
      setSuccess('Order placed successfully.');
      setTimeout(() => router.push('/products'), 2000);
    } catch (err: any) {
      setError(err?.message || 'Unable to place order.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-bg py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white border border-neutral-border rounded-3xl p-10 text-center text-neutral-muted">Loading checkout…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-bg py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white border border-neutral-border rounded-3xl p-10 text-center">
          <h1 className="text-2xl font-bold text-neutral-text">Sign in to continue</h1>
          <p className="mt-3 text-sm text-neutral-muted">Checkout is available once you are signed in and have items in your cart.</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/auth/login" className="px-5 py-3 bg-primary text-white rounded-xl font-semibold">Log In</Link>
            <Link href="/auth/signup" className="px-5 py-3 border border-neutral-border rounded-xl font-semibold">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-bg py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white border border-emerald-100 rounded-3xl p-10 text-center">
          <h1 className="text-3xl font-extrabold text-emerald-900">Order placed successfully</h1>
          <p className="mt-4 text-sm text-emerald-700">Your order is confirmed and your cart has been cleared.</p>
          <p className="mt-2 text-sm text-neutral-muted">You will be redirected back to the marketplace shortly.</p>
          <Link href="/products" className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-bg py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white border border-neutral-border rounded-3xl p-10 text-center">
          <h1 className="text-2xl font-bold text-neutral-text">Your cart is empty</h1>
          <p className="mt-3 text-sm text-neutral-muted">Add something to your cart before checking out.</p>
          <Link href="/products" className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-muted">Checkout</p>
          <h1 className="mt-3 text-3xl font-extrabold text-neutral-text">Complete your order</h1>
          <p className="mt-2 text-sm text-neutral-muted">Review your cart and submit your purchase request.</p>
        </div>

        {success && (
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-6 py-4 text-sm text-emerald-700">{success}</div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>
        )}

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-3xl border border-neutral-border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-3xl bg-neutral-bg overflow-hidden flex items-center justify-center">
                    {item.product?.image_url ? (
                      <img src={item.product.image_url} alt={item.product.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-3xl">🛍️</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-neutral-text">{item.product?.title}</h2>
                    <p className="mt-2 text-sm text-neutral-muted">Quantity: {item.quantity}</p>
                    <p className="mt-1 text-sm text-neutral-muted">Item total: {((item.product?.price ?? 0) * item.quantity).toLocaleString()} FCFA</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-neutral-border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-muted">Order summary</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-neutral-muted">
                <span>Items</span>
                <span>{items.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-neutral-muted">
                <span>Subtotal</span>
                <span>{total.toLocaleString()} FCFA</span>
              </div>
              <div className="flex items-center justify-between text-sm text-neutral-muted">
                <span>Delivery</span>
                <span>Calculated later</span>
              </div>
              <div className="border-t border-neutral-border pt-4 flex items-center justify-between text-lg font-semibold text-neutral-text">
                <span>Total</span>
                <span>{total.toLocaleString()} FCFA</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={busy}
              className="mt-8 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60"
            >
              {busy ? 'Placing order…' : 'Place order'}
            </button>
            <Link href="/cart" className="mt-4 block text-center text-sm font-semibold text-neutral-text hover:text-primary">
              Back to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
