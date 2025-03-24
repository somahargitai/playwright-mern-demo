import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';

const TodosPage = ({ todos, isLoading, error, addTodo, toggleTodo, deleteTodo }) => {
  return (
    <div className="todos-page">
      <h2>Manage Your Todos</h2>
      <TodoForm addTodo={addTodo} />

      {error && <div className="error-message">{error}</div>}

      <TodoList
        todos={todos}
        isLoading={isLoading}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
};

export default TodosPage; 