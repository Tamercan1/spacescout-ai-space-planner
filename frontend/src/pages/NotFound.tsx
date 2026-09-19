// src/pages/NotFound.tsx
import React from 'react';
import "../styles/NotFound.css";

const NotFound: React.FC = () => {

  return (
    <div className="notfound-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>
        Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      <a href="/">Home</a>
    </div>
  );
};

export default NotFound;
