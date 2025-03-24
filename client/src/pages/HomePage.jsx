import { Link } from 'react-router-dom';

const HomePage = ({ todos }) => {
  // Calculate statistics
  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="home-page">
      <h2>Welcome to the Todo App</h2>
      <p>This is a simple todo application built with React and Express.</p>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Task Statistics</h3>
          <div className="stat-item">
            <span>Completed Tasks:</span>
            <span className="stat-value" data-testid="completed-count">{completedCount}</span>
          </div>
          <div className="stat-item">
            <span>Pending Tasks:</span>
            <span className="stat-value" data-testid="pending-count">{pendingCount}</span>
          </div>
          <div className="stat-item">
            <span>Total Tasks:</span>
            <span className="stat-value" data-testid="total-count">{totalCount}</span>
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <Link to="/todos" className="primary-button" data-testid="goto-todos-btn">
          Manage Your Todos
        </Link>
      </div>
    </div>
  );
};

export default HomePage; 