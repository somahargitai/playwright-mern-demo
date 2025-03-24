const AboutPage = () => {
  return (
    <div className="about-page">
      <h2>About This App</h2>
      <p>
        This Todo application was created as a demonstration project for showing Playwright testing capabilities.
      </p>
      <div className="feature-list">
        <h3>Features Demonstrated:</h3>
        <ul>
          <li>CRUD operations with a REST API</li>
          <li>React state management</li>
          <li>URL-based routing with React Router</li>
          <li>Form validation</li>
          <li>Loading states</li>
          <li>Error handling</li>
        </ul>
      </div>
      <p>
        This application is part of a full-stack MERN demo that includes Playwright tests
        for end-to-end testing, visual regression testing, and API testing.
      </p>
    </div>
  );
};

export default AboutPage; 