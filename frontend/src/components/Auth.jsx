import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Auth({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (isLogin && response.ok) {
      const data = await response.json();
      onAuth(data.token);
    } else if (!isLogin && response.ok) {
      alert('Registration successful! Please login.');
      setIsLogin(true);
    } else {
      const errorText = await response.text();
      alert(`Error authenticating: ${errorText}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input 
        type="text" placeholder="Username" required
        className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" placeholder="Password" required
        className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        {isLogin ? 'Login' : 'Register'}
      </button>
      <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-500 hover:underline">
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </form>
  );
}