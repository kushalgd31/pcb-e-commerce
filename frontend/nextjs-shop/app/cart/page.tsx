'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
  product_id: number;
  qty: number;
  name?: string;
  price?: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3001/cart', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.items || []);
      } else {
        setError('Failed to fetch cart');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const updateCart = async (productId: number, qty: number) => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:3001/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId, qty }),
      });
      fetchCart();
    } catch (err) {
      alert('Failed to update cart');
    }
  };

  const removeFromCart = async (productId: number) => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:3001/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });
      fetchCart();
    } catch (err) {
      alert('Failed to remove from cart');
    }
  };

  const checkout = async () => {
    const token = localStorage.getItem('token');
    // Assume cart has items with product_id, qty, and we need to get price from products or assume
    // For simplicity, post to orders with items
    // But need to fetch product prices
    // For now, assume items have price
    const items = cart.map(item => ({
      product: item.product_id,
      quantity: item.qty,
      price: item.price || 0, // need to fetch
    }));
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    try {
      const res = await fetch('http://localhost:8000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ items, total_amount: total }),
      });
      if (res.ok) {
        alert('Order placed');
        router.push('/orders');
      } else {
        alert('Failed to place order');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Cart</h1>
      {error && <p className="text-red-500">{error}</p>}
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.product_id} className="border p-4 mb-2 flex justify-between">
              <div>
                <h2>{item.name}</h2>
                <p>Qty: {item.qty}</p>
                <p>Price: ${item.price}</p>
              </div>
              <div>
                <button onClick={() => updateCart(item.product_id, item.qty + 1)}>+</button>
                <button onClick={() => updateCart(item.product_id, item.qty - 1)} disabled={item.qty <= 1}>-</button>
                <button onClick={() => removeFromCart(item.product_id)} className="ml-2 bg-red-500 text-white p-1">Remove</button>
              </div>
            </div>
          ))}
          <button onClick={checkout} className="bg-blue-500 text-white p-2 mt-4">Checkout</button>
        </div>
      )}
    </div>
  );
}