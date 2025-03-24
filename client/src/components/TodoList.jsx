import React from 'react';

const TodoList = ({ todos, isLoading, error, onToggle, onDelete }) => {

  if (isLoading) {
    return <div className="loading">Loading todos...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <h2>My Todos</h2>
      
      {todos.length === 0 ? (
        <p className="no-todos">No todos found. Add some tasks to get started!</p>
      ) : (
        <ul>
          {todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`} data-testid="todo-item">
              <div className="todo-content">
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  onChange={() => onToggle(todo.id)}
                  className="todo-checkbox toggle"
                  data-testid="todo-toggle"
                />
                <span className="todo-text">{todo.text}</span>
              </div>
              <div className="todo-actions">
                <button 
                  onClick={() => onDelete(todo.id)}
                  className="delete-button destroy"
                  data-testid="todo-delete"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;

