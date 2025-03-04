import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img
            src="https://media.istockphoto.com/id/98001468/photo/bank-sign.jpg?s=1024x1024&w=is&k=20&c=nerSWJ9Fg3X3y8kAxq8LL0Rs0yzpfpkNHUHP6CtVlYY="
            alt="Modern Bank Logo"
            className="footer-logo-img"
          />
          <h2>Modern Bank</h2>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>📧 Email: support@modernbank.com</p>
          <p>📞 Phone: +1 800-123-4567</p>
          <p>🏢 Address: 123 Finance Street, New York, NY</p>
        </div>

        <div className="social-icons">
          <h3>Follow Us</h3>
          <span>🔗 <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></span>
          <span>🔗 <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></span>
          <span>🔗 <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></span>
        </div>
      </div>
      <p className="footer-bottom">&copy; 2025 Modern Bank. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;