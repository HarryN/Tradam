import React from 'react';
import Link from 'next/link';
import { getProducts } from '@/services/product-service';
import { getCategories } from '@/services/category-service';

export default async function ProductsPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const q = params?.q || '';
  const category = params?.category || '';

  const [products, categories] = await Promise.all([
    getProducts({ search: q, category_id: category || undefined, limit: 48 }),
    getCategories(),
  ]);

  const activeCategory = categories.find((item) => item.id === category);

  return (
    <div className="min-h-screen bg-neutral-bg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-text">Marketplace</h1>
            <p className="mt-2 text-sm text-neutral-muted">Browse local products, filter by category, and discover sellers across Cameroon.</p>
            <div className="mt-3 text-xs text-neutral-muted">
              {products.length} active product{products.length !== 1 ? 's' : ''} found{activeCategory ? ` in ${activeCategory.name}` : ''}.
            </div>
          </div>

          <form action="/products" className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 w-full max-w-3xl">
            <div className="flex items-center gap-2">
              <input
                name="q"
                defaultValue={q}
                placeholder="Search products, categories, sellers..."
                className="flex-1 px-3 py-2 rounded-xl border border-neutral-border bg-white text-sm text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <select
                name="category"
                defaultValue={category}
                className="px-3 py-2 rounded-xl border border-neutral-border bg-white text-sm text-neutral-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
              Search
            </button>
          </form>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/products"
            className={`text-sm font-medium px-4 py-2 rounded-full border ${!category ? 'bg-primary text-white border-primary' : 'bg-white text-neutral-text border-neutral-border'} transition-all`}>
            All categories
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${encodeURIComponent(cat.id)}`}
              className={`text-sm font-medium px-4 py-2 rounded-full border ${category === cat.id ? 'bg-primary text-white border-primary' : 'bg-white text-neutral-text border-neutral-border hover:bg-neutral-bg'} transition-all`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-neutral-border bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-neutral-text">No products found</h2>
            <p className="mt-3 text-sm text-neutral-muted">
              Try a broader search, clear the category filter, or explore another category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="group block bg-white border border-neutral-border rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <div className="relative h-60 bg-neutral-bg flex items-center justify-center overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="object-cover w-full h-full" />
                  ) : (
                    <div className="text-5xl">🛍️</div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/80">{p.category?.name || 'Uncategorized'}</p>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-base font-semibold text-neutral-text line-clamp-2">{p.title}</h2>
                  <p className="mt-3 text-sm text-neutral-muted line-clamp-2">{p.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="font-extrabold text-neutral-text">{p.price.toLocaleString()} FCFA</span>
                    <span className="text-xs text-neutral-muted">Stock {p.stock}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
