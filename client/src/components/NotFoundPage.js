import React from "react";
import "../cssFiles/notFoundPage.css"; // Import your CSS file for styling
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <>
      <div className="not-found-container">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBOAydNdZsD1tQryg1e_Yl6nxRnuu6y0lZpg&usqp=CAU" // Add an image that fits your design
          alt="404 Illustration"
          className="not-found-image"
        />
        <div className="not-found-content">
          <h1 className="not-found-heading">Oops! 404 - Page Not Found</h1>
          <p className="not-found-text">
            Sorry, the page you are looking for does not exist.
          </p>
          <p className="not-found-suggestion">
            Maybe you can find what you're looking for on our{" "}
            <Link to="/">homepage</Link>.
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
