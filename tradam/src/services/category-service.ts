import { supabase } from '@/lib/supabase';
import { Category } from '@/types';

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function createCategory(name: string): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name: name.trim() })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
