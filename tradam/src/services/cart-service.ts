import { supabase } from '@/lib/supabase';
import { CartItem, Product } from '@/types';

interface CartData {
  id: string;
  buyer_id: string;
}

export async function getOrCreateCart(buyerId: string): Promise<CartData> {
  const { data, error } = await supabase
    .from('carts')
    .select('id, buyer_id')
    .eq('buyer_id', buyerId)
    .maybeSingle();

  if (error) {
    if (/could not find the table|relation ".*" does not exist/i.test(error.message)) {
      throw new Error(
        'Database table "carts" not found. Run the database migrations or create the `carts` table in Supabase.'
      );
    }
    throw new Error(error.message);
  }
  if (data) return data;

  const { data: created, error: createError } = await supabase
    .from('carts')
    .insert({ buyer_id: buyerId })
    .select('id, buyer_id')
    .single();
  if (createError) {
    if (/could not find the table|relation ".*" does not exist/i.test(createError.message)) {
      throw new Error(
        'Database table "carts" not found. Run the database migrations or create the `carts` table in Supabase.'
      );
    }
    throw new Error(createError.message);
  }
  return created;
}

export async function getCartItems(buyerId: string): Promise<CartItem[]> {
  const cart = await getOrCreateCart(buyerId);

  const { data, error } = await supabase
    .from('cart_items')
    .select('id, cart_id, product_id, quantity, product:products(*, category:categories(id, name))')
    .eq('cart_id', cart.id);
  if (error) {
    if (/could not find the table|relation ".*" does not exist/i.test(error.message)) {
      throw new Error(
        'Database table "cart_items" not found. Run the database migrations or create the `cart_items` table in Supabase.'
      );
    }
    throw new Error(error.message);
  }
  return (data || []) as unknown as CartItem[];
}

export async function addProductToCart(buyerId: string, productId: string, quantity = 1): Promise<CartItem> {
  const cart = await getOrCreateCart(buyerId);

  const { data: existingItem, error: fetchError } = await supabase
    .from('cart_items')
    .select('id, cart_id, product_id, quantity, product:products(*, category:categories(id, name))')
    .eq('cart_id', cart.id)
    .eq('product_id', productId)
    .maybeSingle();

  if (fetchError) {
    if (/could not find the table|relation ".*" does not exist/i.test(fetchError.message)) {
      throw new Error(
        'Database table "cart_items" not found. Run the database migrations or create the `cart_items` table in Supabase.'
      );
    }
    throw new Error(fetchError.message);
  }

  if (existingItem) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
      .select('id, cart_id, product_id, quantity, product:products(*, category:categories(id, name))')
      .single();

    if (error) {
      if (/could not find the table|relation ".*" does not exist/i.test(error.message)) {
        throw new Error(
          'Database table "cart_items" not found. Run the database migrations or create the `cart_items` table in Supabase.'
        );
      }
      throw new Error(error.message);
    }
    return data as unknown as CartItem;
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert({ cart_id: cart.id, product_id: productId, quantity })
    .select('id, cart_id, product_id, quantity, product:products(*, category:categories(id, name))')
    .single();
  if (error) {
    if (/could not find the table|relation ".*" does not exist/i.test(error.message)) {
      throw new Error(
        'Database table "cart_items" not found. Run the database migrations or create the `cart_items` table in Supabase.'
      );
    }
    throw new Error(error.message);
  }
  return data as unknown as CartItem;
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<CartItem | null> {
  if (quantity <= 0) {
    await removeCartItem(itemId);
    return null;
  }

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .select('id, cart_id, product_id, quantity, product:products(*, category:categories(id, name))')
    .single();
  if (error) {
    if (/could not find the table|relation ".*" does not exist/i.test(error.message)) {
      throw new Error(
        'Database table "cart_items" not found. Run the database migrations or create the `cart_items` table in Supabase.'
      );
    }
    throw new Error(error.message);
  }
  return data as unknown as CartItem;
}

export async function removeCartItem(itemId: string): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);
  if (error) {
    if (/could not find the table|relation ".*" does not exist/i.test(error.message)) {
      throw new Error(
        'Database table "cart_items" not found. Run the database migrations or create the `cart_items` table in Supabase.'
      );
    }
    throw new Error(error.message);
  }
}

export async function clearCart(buyerId: string): Promise<void> {
  const cart = await getOrCreateCart(buyerId);
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id);
  if (error) {
    if (/could not find the table|relation ".*" does not exist/i.test(error.message)) {
      throw new Error(
        'Database table "cart_items" not found. Run the database migrations or create the `cart_items` table in Supabase.'
      );
    }
    throw new Error(error.message);
  }
}
