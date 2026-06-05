'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts } from '@/services/product-service';
import { getCategories } from '@/services/category-service';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';
import { Product, Category } from '@/types';
import { useSearchParams } from 'next/navigation';
import { Search, Tag, Package, Filter, SlidersHorizontal } from 'lucide-react';

export default function BuyerMarketplacePage() {
  const { t } = useLanguage();
  const { tc } = useTranslatedContent();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts({ search: q, category_id: category || undefined, limit: 48 }),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [q, category]);

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Search & Filter Header */}
      <div className="bg-white p-8 rounded-3xl border border-neutral-border shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-3xl font-black text-neutral-text tracking-tight">{t('marketplace')}</h1>
            <p className="mt-2 text-sm text-neutral-muted font-medium">Discover authentic Cameroonian products from verified local sellers.</p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-bg rounded-2xl border border-neutral-border">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-xs font-black text-neutral-text uppercase tracking-widest">
              {products.length} {t('activeProducts')}
            </span>
          </div>
        </div>

        <form action="/buyers/marketplace" className="grid grid-cols-1 md:grid-cols-[1fr_200px_auto] gap-4">
          <div className="relative group">
            <input
              name="q"
              defaultValue={q}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-neutral-border bg-neutral-bg/30 text-sm text-neutral-text focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
            />
            <Search className="w-5 h-5 text-neutral-muted absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
          </div>

          <div className="relative">
            <select
              name="category"
              defaultValue={category}
              className="w-full pl-4 pr-10 py-3.5 rounded-2xl border border-neutral-border bg-neutral-bg/30 text-sm text-neutral-text focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold appearance-none cursor-pointer"
            >
              <option value="">{t('allCategories')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{t(c.name)}</option>
              ))}
            </select>
            <Tag className="w-4 h-4 text-neutral-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button type="submit" className="px-8 py-3.5 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all active:scale-[0.98]">
            {t('search')}
          </button>
        </form>

        {/* Quick Category Filters */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href="/buyers/marketplace"
            className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all ${
              !category ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-neutral-muted border-neutral-border hover:bg-neutral-bg'
            }`}
          >
            {t('allCategories')}
          </Link>
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/buyers/marketplace?category=${encodeURIComponent(cat.id)}`}
              className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all ${
                category === cat.id ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-neutral-muted border-neutral-border hover:bg-neutral-bg'
              }`}
            >
              {t(cat.name)}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-neutral-border p-5 space-y-4 animate-pulse">
              <div className="h-48 bg-neutral-bg rounded-2xl" />
              <div className="h-4 bg-neutral-bg rounded-full w-2/3" />
              <div className="h-3 bg-neutral-bg rounded-full w-full" />
              <div className="h-8 bg-neutral-bg rounded-xl" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-border p-20 text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-neutral-bg rounded-full flex items-center justify-center mx-auto text-neutral-muted">
            <SlidersHorizontal className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black text-neutral-text">{t('noProductsFound')}</h2>
          <p className="text-sm text-neutral-muted max-w-xs mx-auto">{t('noProductsSub')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((p) => (
            <Link 
              key={p.id} 
              href={`/products/${p.id}`} 
              className="group bg-white border border-neutral-border rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="relative aspect-[4/3] bg-neutral-bg flex items-center justify-center overflow-hidden m-2 rounded-[2rem]">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="text-5xl">🛍️</div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-neutral-border/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">{t(p.category?.name || 'others')}</p>
                </div>
              </div>
              
              <div className="p-6 pt-4 space-y-4">
                <h2 className="text-base font-black text-neutral-text line-clamp-2 leading-tight group-hover:text-primary transition-colors">{tc(p.title)}</h2>
                
                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-neutral-muted uppercase tracking-widest leading-none mb-1">{t('price')}</p>
                    <p className="text-lg font-black text-neutral-text leading-none">
                      {p.price.toLocaleString()} <span className="text-xs text-primary">{t('priceCurrency')}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-neutral-muted uppercase tracking-widest leading-none mb-1">{t('stock')}</p>
                    <p className="text-xs font-bold text-neutral-text leading-none">{p.stock} {t('inStock')}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
