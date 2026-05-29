import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

// ─── Read ────────────────────────────────────────────────────────────────────

export async function getSellerProducts(sellerId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id, name)')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id, name)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createProduct(
  product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select('*, category:categories(id, name)')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id' | 'created_at' | 'category'>>
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, category:categories(id, name)')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// ─── Toggle Active ───────────────────────────────────────────────────────────

export async function toggleProductActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// ─── Image Upload ─────────────────────────────────────────────────────────────

export async function uploadProductImage(file: File, sellerId: string): Promise<string> {
  // Generate unique filename
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${sellerId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  // Get the public URL
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  // Extract file path from URL
  const urlParts = imageUrl.split('/product-images/');
  if (urlParts.length < 2) return;
  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from('product-images')
    .remove([filePath]);

  if (error) console.error('Failed to delete image:', error.message);
}
