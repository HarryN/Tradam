'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

export default function RecommendationsList({ productId, userId }: { productId?: string; userId?: string }) {
  const [items, setItems] = useState<Product[]>([]);
  const { t } = useLanguage();
  const { tc } = useTranslatedContent();

  useEffect(() => {
    const q = productId ? `?productId=${productId}` : userId ? `?userId=${userId}` : '';
    fetch(`/api/recommendations${q}`)
      .then((r) => r.json())
      .then((data) => setItems(data || []))
      .catch(() => setItems([]));
  }, [productId, userId]);

  if (!items || items.length === 0) return null;

  return (
    <div className="mt-12 pb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-neutral-text">{t('recommendationsTitle')}</h2>
        <p className="text-sm text-neutral-muted">{items.length} {t('recommendations')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="group rounded-2xl border border-neutral-border bg-white overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300">
            {/* Product Image */}
            <div className="w-full h-48 bg-neutral-bg flex items-center justify-center overflow-hidden">
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="text-5xl">🛍️</div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Category */}
              {p.category && <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{t(p.category.name)}</p>}

              {/* Title */}
              <h3 className="text-sm font-bold text-neutral-text group-hover:text-primary transition-colors line-clamp-2 mb-2">{tc(p.title)}</h3>

              {/* Description */}
              <p className="text-xs text-neutral-muted line-clamp-2 mb-3 leading-relaxed">{tc(p.description)}</p>

              {/* Price & Stock */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-extrabold text-neutral-text">{p.price.toLocaleString()} FCFA</p>
                  <p className="text-xs text-neutral-muted mt-0.5">{p.stock} {t('stockAvailable')}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
