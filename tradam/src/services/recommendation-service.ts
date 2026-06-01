import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { getClusteredProducts } from './clustering-service';

export async function getRelatedProducts(productId: string, limit = 6): Promise<Product[]> {
  // Try cluster-based recommendations first
  const clusterProductIds = await getClusteredProducts(productId, limit);

  if (clusterProductIds.length > 0) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', clusterProductIds)
      .eq('is_active', true);

    if (!error && data && data.length > 0) {
      return (data || []) as Product[];
    }
  }

  // Fallback: category-based recommendations
  const { data: prod, error: prodErr } = await supabase
    .from('products')
    .select('id, category_id')
    .eq('id', productId)
    .single();

  if (prodErr || !prod) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .neq('id', productId)
    .eq('category_id', prod.category_id)
    .eq('is_active', true)
    .limit(limit);

  if (error) return [];
  return (data || []) as Product[];
}

export async function getPersonalizedRecommendations(userId: string, limit = 6): Promise<Product[]> {
  // Get categories from recent purchases
  const { data: items } = await supabase
    .from('order_items')
    .select('product:products(id, category_id) , order:orders(id, buyer_id)')
    .eq('order.buyer_id', userId)
    .order('id', { ascending: false })
    .limit(50);

  const categoryIds = Array.from(
    new Set(
      (items || [])
        .map((it: any) => it.product?.category_id)
        .filter(Boolean)
    )
  );

  if (categoryIds.length === 0) {
    // fallback: popular / recent products
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    return (data || []) as Product[];
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('category_id', categoryIds)
    .eq('is_active', true)
    .limit(limit);

  if (error) return [];
  return (data || []) as Product[];
}
