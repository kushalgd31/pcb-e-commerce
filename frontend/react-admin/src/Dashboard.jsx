import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      navigate('/login');
      return;
    }
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) return <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px'
  }}>Loading...</div>;

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
      }}>Dashboard</h1>
      <p style={{
        fontSize: '18px',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#555'
      }}>Welcome, {user.email}</p>
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px'
      }}>
        {user.role === 'admin' && <Link to="/products" style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          textDecoration: 'none',
          borderRadius: '4px',
          transition: 'background-color 0.3s'
        }} onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'} onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}>Products</Link>}
        <Link to="/orders" style={{
          backgroundColor: '#28a745',
          color: 'white',
          padding: '10px 20px',
          textDecoration: 'none',
          borderRadius: '4px',
          transition: 'background-color 0.3s'
        }} onMouseOver={(e) => e.target.style.backgroundColor = '#1e7e34'} onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}>Orders</Link>
      </nav>
    </div>
  );
}

export default Dashboard;