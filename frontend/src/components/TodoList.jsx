import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function TodoList({ token }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchTodos = async () => {
    const res = await fetch(`${API_URL}/todos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setTodos(await res.json());
  };

  useEffect(() => { fetchTodos(); }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ text: newTodo })
    });
    setNewTodo('');
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchTodos();
  };

  const updateTodo = async (id) => {
    await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ text: editText })
    });
    setEditingId(null);
    fetchTodos();
  };

  return (
    <div>
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input 
          type="text" placeholder="Add a new task..." value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="border p-2 rounded flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button type="submit" className="bg-green-500 text-white px-4 rounded hover:bg-green-600">Add</button>
      </form>

      <ul className="flex flex-col gap-2">
        {todos.map(todo => (
          <li key={todo._id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
            {editingId === todo._id ? (
              <div className="flex gap-2 flex-1 mr-2">
                <input 
                  type="text" value={editText} onChange={(e) => setEditText(e.target.value)}
                  className="border p-1 rounded flex-1 text-sm" autoFocus
                />
                <button onClick={() => updateTodo(todo._id)} className="text-green-600 text-sm">Save</button>
                <button onClick={() => setEditingId(null)} className="text-gray-500 text-sm">Cancel</button>
              </div>
            ) : (
              <>
                <span className="text-gray-800 break-all">{todo.text}</span>
                <div className="flex gap-3 ml-4">
                  <button onClick={() => { setEditingId(todo._id); setEditText(todo.text); }} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                  <button onClick={() => deleteTodo(todo._id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}