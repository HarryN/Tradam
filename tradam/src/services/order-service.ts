import { supabase } from '@/lib/supabase';
import { BuyerOrder, CartItem, Order, OrderItem } from '@/types';
import { clearCart } from '@/services/cart-service';

export async function createOrderFromCart(buyerId: string, items: CartItem[]): Promise<Order> {
  if (!items || items.length === 0) {
      throw new Error('Cart is empty');
  }

  const totalPrice = items.reduce((sum, item) => {
    const price = item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ buyer_id: buyerId, total_price: totalPrice, status: 'pending' })
    .select('*')
    .single();

    if (orderError) {
      if (/could not find the table|relation ".*" does not exist/i.test(orderError.message)) {
        throw new Error(
          'Database table "orders" not found. Run the database migrations or create the `orders` table in Supabase.'
        );
      }
      throw new Error(orderError.message);
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id ?? item.product?.id,
    quantity: item.quantity,
    unit_price: item.product?.price ?? 0,
    seller_id: item.product?.seller_id ?? null,
    seller_status: 'pending',
  }));

  // Ensure we have seller_id for every order item. If some items lack product.seller_id, fetch them in batch.
  const missingSellerIds = orderItems.filter((it) => !it.seller_id).map((it) => it.product_id);
  if (missingSellerIds.length > 0) {
    const { data: productsData } = await supabase
      .from('products')
      .select('id, seller_id')
      .in('id', missingSellerIds);
    const sellerMap: Record<string, string> = {};
    (productsData || []).forEach((p: any) => { sellerMap[p.id] = p.seller_id; });
    orderItems.forEach((it) => {
      if (!it.seller_id) it.seller_id = sellerMap[it.product_id] ?? null;
    });
  }

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
      if (/could not find the table|relation ".*" does not exist/i.test(itemsError.message)) {
        throw new Error(
          'Database table "order_items" not found. Run the database migrations or create the `order_items` table in Supabase.'
        );
      }
    throw new Error(itemsError.message);
  }

  await clearCart(buyerId);

  return order as Order;
}

export async function getOrdersByBuyerId(buyerId: string): Promise<BuyerOrder[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(*))')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map((row: any) => ({
    id: row.id,
    buyer_id: row.buyer_id,
    status: row.status,
    total_price: row.total_price,
    created_at: row.created_at,
    items: (row.order_items || []).map((item: any) => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      seller_id: item.seller_id,
      seller_status: item.seller_status,
      product: item.product,
    })),
  }));
}

// Get aggregated orders and items relevant to a seller (orders that include at least one item from this seller)
export async function getOrdersForSeller(sellerId: string): Promise<Array<{ order: Order; items: OrderItem[] }>> {
  // fetch order_items with joined product and order data
  const { data, error } = await supabase
    .from('order_items')
    .select('*, order:orders(*), product:products(*)')
    .eq('seller_id', sellerId);

  if (error) throw new Error(error.message);

  const rows = (data || []) as any[];

  const sellerItems = rows.filter((r) => r.order && (r.seller_id === sellerId || r.product?.seller_id === sellerId));

  // group by order
  const grouped: Record<string, { order: Order; items: OrderItem[] }> = {};
  for (const row of sellerItems) {
    const o: Order = row.order;
    const item: OrderItem = {
      id: row.id,
      order_id: row.order_id,
      product_id: row.product_id,
      quantity: row.quantity,
      unit_price: row.unit_price,
      seller_id: row.seller_id ?? row.product?.seller_id,
      seller_status: row.seller_status,
      product: row.product,
    };

    if (!grouped[o.id]) grouped[o.id] = { order: o, items: [] };
    grouped[o.id].items.push(item);
  }

  return Object.values(grouped);
}

export async function updateOrderItemStatus(itemId: string, status: string): Promise<OrderItem> {
  const { data, error } = await supabase
    .from('order_items')
    .update({ seller_status: status })
    .eq('id', itemId)
    .select('*')
    .single();

  if (error) {
    if (/could not find the table|relation ".*" does not exist/i.test(error.message)) {
      throw new Error('Database table "order_items" not found. Run the database migrations.');
    }
    throw new Error(error.message);
  }

  return data as OrderItem;
}
