import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./About.css"; // Import CSS for styling

const About = () => {
  const navigate = useNavigate(); // Use useNavigate hook
  
  return (
    <div className="about-page">
      <div className="about-content">
        {/* Left Side - Text Content */}
        <div className="about-text">
          <h1>About Modern Bank</h1>
          <p>
            Modern Bank is committed to providing secure, efficient, and
            innovative banking solutions to meet your financial needs.
          </p>

          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              Our mission is to simplify financial transactions and help users
              manage their money effortlessly through our digital banking platform.
            </p>
          </div>

          <div className="about-section">
            <h2>Our Vision</h2>
            <p>
              To be the leading digital banking platform, offering seamless, secure,
              and user-friendly banking services for everyone.
            </p>
          </div>

          <div className="about-section">
            <h2>Why Choose Us?</h2>
            <ul>
              <li>✅ Secure transactions with advanced encryption</li>
              <li>✅ 24/7 Customer Support</li>
              <li>✅ Easy-to-use interface for seamless banking</li>
              <li>✅ Fast and reliable banking solutions</li>
              <li>✅ AI-driven financial insights and reports</li>
              <li>✅ Mobile and web access for convenience</li>
            </ul>
          </div>

          <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>
        </div>

        {/* Right Side - Image */}
        <div className="about-image">
          <img src="https://source.unsplash.com/800x800/?banking,finance" alt="Modern Bank" />
        </div>
      </div>
    </div>
  );
};

export default About;