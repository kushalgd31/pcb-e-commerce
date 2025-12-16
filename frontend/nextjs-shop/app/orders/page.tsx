'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Order {
  id: number;
  status: string;
  total_amount: string;
  created_at: string;
  items: any[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:8000/api/orders/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">My Orders</h1>
      {error && <p className="text-red-500">{error}</p>}
      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-2">
          <p>Order ID: {order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total_amount}</p>
          <p>Created: {order.created_at}</p>
          <div>
            {order.items.map((item: any) => (
              <p key={item.id}>{item.product_name} x {item.quantity}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}