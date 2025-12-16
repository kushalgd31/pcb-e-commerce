'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/products/');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const addToCart = async (productId: number) => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:3001/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId, qty: 1 }),
      });
      alert('Added to cart');
    } catch (err) {
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Products</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4">
            <h2 className="text-xl">{product.name}</h2>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <p>Stock: {product.stock}</p>
            <button
              onClick={() => addToCart(product.id)}
              className="bg-green-500 text-white p-2 mt-2"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => router.push('/cart')} className="bg-blue-500 text-white p-2 mt-4">View Cart</button>
    </div>
  );
}