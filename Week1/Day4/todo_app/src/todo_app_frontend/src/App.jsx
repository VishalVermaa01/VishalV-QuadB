import React, { useState, useEffect } from 'react';
import { todo_app_backend } from 'declarations/todo_app_backend';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    // Get all todos when the app starts
    const loadTodos = async () => {
        const result = await todo_app_backend.getTodos();
        setTodos(result);
    };

    // Add a new todo
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        await todo_app_backend.addTodo(newTodo);
        setNewTodo('');
        loadTodos();
    };

    // Mark a todo as done/not done
    const handleToggle = async (id) => {
        await todo_app_backend.toggleTodo(id);
        loadTodos();
    };

    // Delete a todo
    const handleDelete = async (id) => {
        await todo_app_backend.deleteTodo(id);
        loadTodos();
    };

    useEffect(() => {
        loadTodos();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Todo List</h1>

            <form onSubmit={handleAdd} className="mb-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="border p-2 mr-2"
                    placeholder="Add new todo"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Add
                </button>
            </form>

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggle(todo.id)}
                            className="mr-2"
                        />
                        <span className={todo.completed ? 'line-through' : ''}>
                            {todo.text}
                        </span>
                        <button
                            onClick={() => handleDelete(todo.id)}
                            className="ml-auto text-red-500"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;