import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <p className="text-gray-500 mt-2">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;