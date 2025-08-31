import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Your ultimate destination for movie recommendations and discoveries.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Connect with us </h3>
          <div className="social-links">

      
            <a href="https://www.linkedin.com/in/saathvik-sheerla/"  className="social-link">Saathvik</a>
            <p>&</p>
            <a href="https://www.linkedin.com/in/g-akshay-851a0b25b/" className="social-link">Akshay</a>        

          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Movie Recommendations. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 