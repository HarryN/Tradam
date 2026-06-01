import React from 'react';
import { getPublicProductById } from '@/services/product-service';
import Link from 'next/link';
import AddToCartButton from '@/features/cart/AddToCartButton';
import RecommendationsList from '@/features/recommendations/RecommendationsList';

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getPublicProductById(resolvedParams.id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Product not found</h2>
          <p className="mt-2 text-neutral-muted">This product may have been removed or is unavailable.</p>
          <Link href="/products" className="mt-4 inline-block text-primary font-semibold">Back to marketplace</Link>
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
            <div className="text-sm text-neutral-muted">{product.category?.name || 'Uncategorized'}</div>
            <h1 className="text-2xl font-bold text-neutral-text mt-2">{product.title}</h1>
            <div className="mt-3 text-xl font-extrabold text-neutral-text">{product.price.toLocaleString()} FCFA</div>
            <p className="mt-4 text-neutral-muted leading-relaxed">{product.description}</p>

            <div className="mt-6 flex flex-col sm:flex-row items-start gap-3">
              <AddToCartButton productId={product.id} />
              <Link href="/cart" className="inline-flex items-center justify-center px-5 py-3 border border-neutral-border rounded-lg text-sm font-semibold text-neutral-text hover:bg-neutral-bg transition-colors">
                View Cart
              </Link>
            </div>

            <div className="mt-6 text-sm text-neutral-muted">
              <div>Seller ID: {product.seller_id}</div>
              <div>Stock: {product.stock}</div>
              <div>Added: {new Date(product.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecommendationsList productId={product.id} />
      </div>
    </div>
  );
}
