import { useState } from 'react';
import Auth from './components/Auth';
import TodoList from './components/TodoList';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleAuth = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">To Do List</h1>
        {token && (
          <button onClick={handleLogout} className="text-sm bg-white text-blue-600 px-4 py-1.5 rounded hover:bg-gray-100">
            Logout
          </button>
        )}
      </div>

      <div className="p-6 max-w-3xl mx-auto">
        {token ? (
          <TodoList token={token} />
        ) : (
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-sm">
              <Auth onAuth={handleAuth} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;