import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  
  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>We are here to assist you. Reach out to us through any of the channels below.</p>
      </header>
      
      {/* Contact Options */}
      <section className="contact-options">
        <div className="contact-option">
          <h2>Request a Callback</h2>
          <p>Provide your contact details, and we'll get back to you as soon as possible.</p>
        </div>
        <div className="contact-option">
          <h2>Visit Us</h2>
          <p>Locate the nearest branch or ATM to access our banking services.</p>
        </div>
        <div className="contact-option">
          <h2>Live Chat</h2>
          <p>Chat with our support team in real time for immediate assistance.</p>
        </div>
      </section>
      
      {/* Contact Details */}
      <section className="contact-info">
        <div className="contact-card">
          <h3>Customer Support</h3>
          <p><strong>Phone:</strong> +254 700 123 456</p>
          <p><strong>Email:</strong> <a href="mailto:support@modernbank.com">support@modernbank.com</a></p>
          <p><strong>Working Hours:</strong> Mon - Fri: 8:00 AM - 6:00 PM</p>
          <p><strong>Emergency Support:</strong> 24/7 via phone</p>
        </div>

        <div className="contact-card">
          <h3>Follow Us</h3>
          <p><strong>Twitter:</strong> <a href="https://twitter.com/modernbank">@ModernBank</a></p>
          <p><strong>Facebook:</strong> <a href="https://facebook.com/modernbank">Modern Bank</a></p>
          <p><strong>Instagram:</strong> <a href="https://instagram.com/modernbank">modernbank</a></p>
          <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/company/modernbank">Modern Bank Ltd.</a></p>
        </div>
      </section>

      {/* Inquiry Form Placeholder */}
      <section className="inquiry-form">
        <h2>General Inquiry</h2>
        <p>Have a question? Fill out the form below, and we'll get back to you.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </section>

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>
    </div>
  );
};

export default Contact;