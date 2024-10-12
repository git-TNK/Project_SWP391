import React from "react";
import { Link } from "react-router-dom";

function NotFound404() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          Oops! Page not found.
        </h2>
        <p className="text-gray-600 mt-2">
          {`Sorry, the page you are looking for doesn't exist.`}
        </p>

        <Link to="/">
          <button className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-300 font-medium">
            Go back to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound404;
