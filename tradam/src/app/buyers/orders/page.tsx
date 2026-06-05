'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/auth-context';
import { getOrdersByBuyerId } from '@/services/order-service';
import { BuyerOrder } from '@/types';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';
import { Package, Clock, CheckCircle2, ChevronRight, AlertCircle, ShoppingBag } from 'lucide-react';
import ReviewForm from '@/features/ratings/ReviewForm';
import { supabase } from '@/lib/supabase';

export default function BuyerOrdersPage() {
  const { t } = useLanguage();
  const { tc } = useTranslatedContent();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      setError(null);
      try {
        const data = await getOrdersByBuyerId(user.id);
        setOrders(data);
      } catch (err: any) {
        setError(err?.message || t('loadOrdersError') || 'Unable to load orders.');
      }
    };

    loadOrders();
  }, [user, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-black text-neutral-text tracking-tight">{t('yourOrders')}</h1>
        <p className="mt-2 text-sm text-neutral-muted font-medium">{t('ordersSub')}</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-border p-16 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 bg-neutral-bg rounded-full flex items-center justify-center mx-auto text-neutral-muted">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-text">{t('noOrders')}</h2>
            <p className="mt-2 text-sm text-neutral-muted max-w-xs mx-auto">{t('noOrdersSub')}</p>
          </div>
          <Link href="/products" className="inline-flex px-8 py-3 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary-hover transition-all">
            {t('shopNow')}
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-neutral-border shadow-sm overflow-hidden group hover:border-primary/30 transition-all">
              {/* Order Header */}
              <div className="p-6 bg-neutral-bg/30 border-b border-neutral-border flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-border flex items-center justify-center text-neutral-muted">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-widest">Order ID</p>
                    <p className="text-sm font-black text-neutral-text font-mono truncate max-w-[150px]">{order.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 text-right">
                  <div>
                    <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-widest">{t('placed')}</p>
                    <p className="text-sm font-bold text-neutral-text">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-widest">{t('total')}</p>
                    <p className="text-lg font-black text-primary">{order.total_price.toLocaleString()} {t('priceCurrency')}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 space-y-6 divide-y divide-neutral-border/50">
                {order.items.map((item) => (
                  <div key={item.id} className="pt-6 first:pt-0 space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-border group-hover:shadow-xs transition-shadow">
                      <div className="w-16 h-16 rounded-xl bg-neutral-bg overflow-hidden border border-neutral-border shrink-0">
                        {item.product?.image_url ? (
                          <img src={item.product.image_url} alt={item.product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-neutral-text truncate">{tc(item.product?.title) || item.product_id}</h4>
                        <p className="text-xs text-neutral-muted font-semibold mt-1">{t('qty')}: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-widest">{t('fulfillment')}</p>
                        <div className="mt-1 flex items-center justify-end gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            item.seller_status === 'shipped' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`} />
                          <span className="text-xs font-black text-neutral-text uppercase">{t(item.seller_status || 'pending')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Inline Review Form for shipped/delivered items */}
                    {item.seller_status === 'shipped' && (
                      <div className="ml-4 pl-4 border-l-2 border-primary/20">
                        <ReviewForm 
                          productId={item.product_id} 
                          order_id={order.id} 
                          buyerId={user!.id} 
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
