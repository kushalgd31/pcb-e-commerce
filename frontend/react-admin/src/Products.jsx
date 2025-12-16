import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      navigate('/login');
      return;
    }
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:8000/api/products/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `http://localhost:8000/api/products/${editing}/` : 'http://localhost:8000/api/products/';
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        fetchProducts();
        setForm({ name: '', description: '', price: '', stock: '' });
        setEditing(null);
      } else {
        setError('Failed to save product');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:8000/api/products/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const editProduct = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        fontSize: '28px',
        marginBottom: '20px',
        color: '#333',
        textAlign: 'center'
      }}>Products</h1>
      {error && <p style={{
        color: 'red',
        textAlign: 'center',
        marginBottom: '20px'
      }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        maxWidth: '600px',
        margin: '0 auto 30px'
      }}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box',
            minHeight: '80px'
          }}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
          required
        />
        <button type="submit" style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
          width: '100%',
          transition: 'background-color 0.3s'
        }} onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'} onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}>
          {editing ? 'Update' : 'Add'} Product
        </button>
      </form>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {products.map((product) => (
          <div key={product.id} style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #ddd'
          }}>
            <h2 style={{
              fontSize: '20px',
              marginBottom: '10px',
              color: '#333'
            }}>{product.name}</h2>
            <p style={{
              marginBottom: '10px',
              color: '#666'
            }}>{product.description}</p>
            <p style={{
              fontWeight: 'bold',
              marginBottom: '5px',
              color: '#28a745'
            }}>${product.price}</p>
            <p style={{
              marginBottom: '15px',
              color: '#666'
            }}>Stock: {product.stock}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => editProduct(product)} style={{
                backgroundColor: '#ffc107',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: 1,
                transition: 'background-color 0.3s'
              }} onMouseOver={(e) => e.target.style.backgroundColor = '#e0a800'} onMouseOut={(e) => e.target.style.backgroundColor = '#ffc107'}>Edit</button>
              <button onClick={() => deleteProduct(product.id)} style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: 1,
                transition: 'background-color 0.3s'
              }} onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'} onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;