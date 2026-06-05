'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/context/auth-context';
import { getOrdersForSeller, updateOrderItemStatus } from '@/services/order-service';
import { Order, OrderItem } from '@/types';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

export default function SellerOrdersPage() {
  const { t } = useLanguage();
  const { tc } = useTranslatedContent();
  const { user, loading } = useAuth();
  const [data, setData] = useState<Array<{ order: Order; items: OrderItem[] }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setError(null);
      try {
        const d = await getOrdersForSeller(user.id);
        setData(d || []);
      } catch (err: any) {
        setError(err?.message || t('loadOrdersError') || 'Unable to load orders.');
      }
    };

    load();

    const channel = supabase
      .channel('seller-orders-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, () => {
        load();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, t]);

  if (loading) return <div className="p-8">{t('loadingOrders')}</div>;
  if (!user) return (
    <div className="p-8">
      <p>{t('pleaseSignInSeller')}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-bg py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-muted">{t('storeOrders')}</p>
          <h1 className="mt-3 text-3xl font-extrabold text-neutral-text">{t('ordersForProducts')}</h1>
          <p className="mt-2 text-sm text-neutral-muted">{t('ordersSubtitle')}</p>
        </div>

        {error && (<div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>)}

        {data.length === 0 ? (
          <div className="rounded-3xl border border-neutral-border bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-neutral-text">{t('noOrders')}</h2>
            <p className="mt-3 text-sm text-neutral-muted">{t('noOrdersSub')}</p>
            <Link href="/sellers/products" className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors shadow-sm">{t('myProducts')}</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map(({ order, items }) => (
              <div key={order.id} className="rounded-3xl border border-neutral-border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-muted">{t('orderId')}</p>
                    <p className="text-lg font-semibold text-neutral-text break-all">{order.id}</p>
                    <p className="text-sm text-neutral-muted">{t('placed')}: {new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-muted">{t('status')}</p>
                    <p className="font-semibold text-neutral-text capitalize">{t(order.status) || order.status}</p>
                    <p className="text-sm text-neutral-muted">{t('orderTotal')}</p>
                    <p className="font-semibold text-neutral-text">{order.total_price.toLocaleString()} {t('priceCurrency')}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-neutral-text">{t('product')}: {tc(it.product?.title) ?? it.product_id}</p>
                        <p className="text-xs text-neutral-muted">{t('quantity')}: {it.quantity}</p>
                        <p className="text-xs text-neutral-muted">{t('fulfillment')}: {t(it.seller_status || 'pending')}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-semibold">{(it.unit_price ?? 0).toLocaleString()} {t('priceCurrency')}</div>
                        {it.seller_status !== 'shipped' && (
                          <button
                            onClick={async () => {
                              try {
                                await updateOrderItemStatus(it.id, 'shipped');
                                // refresh view
                                const d = await getOrdersForSeller(user.id);
                                setData(d);
                              } catch (err: any) {
                                setError(err?.message || t('statusUpdateError') || 'Unable to update status');
                              }
                            }}
                            className="text-sm px-3 py-1 bg-emerald-600 text-white rounded-lg shadow-sm hover:bg-emerald-700 transition-colors"
                          >
                            {t('markShipped')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
