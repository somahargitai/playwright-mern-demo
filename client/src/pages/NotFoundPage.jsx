import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <div className="action-buttons">
        <Link to="/" className="primary-button">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 