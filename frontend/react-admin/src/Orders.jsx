import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
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

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:8000/api/orders/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
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
      }}>Orders</h1>
      {error && <p style={{
        color: 'red',
        textAlign: 'center',
        marginBottom: '20px'
      }}>{error}</p>}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {orders.map((order) => (
          <div key={order.id} style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            border: '1px solid #ddd'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <h2 style={{
                fontSize: '20px',
                color: '#333'
              }}>Order ID: {order.id}</h2>
              <span style={{
                padding: '5px 10px',
                borderRadius: '4px',
                color: 'white',
                backgroundColor: order.status === 'pending' ? '#ffc107' : order.status === 'approved' ? '#28a745' : '#dc3545'
              }}>{order.status}</span>
            </div>
            <p style={{ marginBottom: '5px', color: '#666' }}>User: {order.user}</p>
            <p style={{ marginBottom: '5px', color: '#666' }}>Total: ${order.total_amount}</p>
            <p style={{ marginBottom: '15px', color: '#666' }}>Created: {order.created_at}</p>
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>Items:</h3>
              {order.items.map((item) => (
                <p key={item.id} style={{ color: '#666' }}>{item.product_name} x {item.quantity}</p>
              ))}
            </div>
            {order.status === 'pending' && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => updateStatus(order.id, 'approved')} style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }} onMouseOver={(e) => e.target.style.backgroundColor = '#1e7e34'} onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}>Approve</button>
                <button onClick={() => updateStatus(order.id, 'rejected')} style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }} onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'} onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;