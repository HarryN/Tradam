'use client';

import React, { useEffect, useState } from 'react';
import { getPublicProductById } from '@/services/product-service';
import Link from 'next/link';
import AddToCartButton from '@/features/cart/AddToCartButton';
import RecommendationsList from '@/features/recommendations/RecommendationsList';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';
import { Product } from '@/types';
import { useParams } from 'next/navigation';
import { useAuth } from '@/features/auth/context/auth-context';
import { trackInteraction } from '@/services/interaction-service';

export default function ProductDetail() {
  const { t } = useLanguage();
  const { tc } = useTranslatedContent();
  const { user } = useAuth();
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const data = await getPublicProductById(id);
        setProduct(data);
        
        // Track view interaction
        if (user) {
          trackInteraction(user.id, id, 'view');
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
        <div className="text-center">
          <h2 className="text-xl font-bold">{t('productNotFound')}</h2>
          <p className="mt-2 text-neutral-muted">{t('productNotFoundSub')}</p>
          <Link href="/products" className="mt-4 inline-block text-primary font-semibold">{t('backToMarketplace')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-neutral-border rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-96 bg-neutral-bg flex items-center justify-center">
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} className="object-contain max-h-96" />
            ) : (
              <div className="text-6xl">🛍️</div>
            )}
          </div>

          <div className="p-6">
            <div className="text-sm text-neutral-muted">{t(product.category?.name || 'uncategorized')}</div>
            <h1 className="text-2xl font-bold text-neutral-text mt-2">{tc(product.title)}</h1>
            <div className="mt-3 text-xl font-extrabold text-neutral-text">{product.price.toLocaleString()} {t('priceCurrency')}</div>
            <p className="mt-4 text-neutral-muted leading-relaxed">{tc(product.description)}</p>

            <div className="mt-6 flex flex-col sm:flex-row items-start gap-3">
              <AddToCartButton productId={product.id} />
              <Link href="/cart" className="inline-flex items-center justify-center px-5 py-3 border border-neutral-border rounded-lg text-sm font-semibold text-neutral-text hover:bg-neutral-bg transition-colors">
                {t('viewCart')}
              </Link>
            </div>

            <div className="mt-6 text-sm text-neutral-muted">
              <div>{t('sellerId')}: {product.seller_id}</div>
              <div>{product.stock} {t('stockAvailable')}</div>
              <div>{t('addedDate')}: {new Date(product.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <RecommendationsList productId={product.id} />
      </div>
    </div>
  );
}
