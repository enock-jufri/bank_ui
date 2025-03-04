import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";
import Footer from "./Footer";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container"d >
      {/* Navigation Bar */}
      <nav className="navbar">
        <h2 className="logo">MODERN BANK</h2>
        <ul className="nav-links">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/login")}>Login</li>
          <li onClick={() => navigate("/about")}>About</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>Welcome to Modern Bank</h1>
          <p>Experience seamless banking with high security and convenience.</p>
          <button className="get-started-btn" onClick={() => navigate("/login")}>
            Get Started
          </button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits">
        <h2>Why Choose Us?</h2>
        <div className="benefit-items">
          <div className="benefit-item">
            ✔️ Secure & Encrypted Transactions - Your data and transactions are protected with state-of-the-art encryption technology.
          </div>
          <div className="benefit-item">
            ✔️ 24/7 Customer Support - Our dedicated team is always available to assist you, no matter where you are.
          </div>
          <div className="benefit-item">
            ✔️ No Hidden Fees - We believe in transparency, and we don’t charge any hidden fees.
          </div>
          <div className="benefit-item">
            ✔️ Fast & Easy Transfers - Transfer money quickly and efficiently both locally and internationally.
          </div>
          <div className="benefit-item">
            ✔️ Mobile & Web Access - Manage your finances anytime with our responsive mobile and web applications.
          </div>
          <div className="benefit-item">
            ✔️ High-Interest Savings - Earn competitive interest rates on your savings and investments.
          </div>
          <div className="benefit-item">
            ✔️ AI-Powered Financial Insights - Get personalized insights and smart budgeting recommendations.
          </div>
        </div>
      </div>

      {/* How We Work */}
      <div className="how-we-work">
        <h2>How We Work</h2>
        <p>At Modern Bank, we prioritize your financial well-being by offering innovative and secure banking solutions.</p>
        <div className="work-steps">
          <div className="work-step">
            <h3>Account Management</h3>
            <p>Easily open and manage accounts, update details, and track transactions.</p>
          </div>
          <div className="work-step">
            <h3>Online & Mobile Banking</h3>
            <p>Access banking services anytime, including bill payments, transfers, and statements.</p>
          </div>
          <div className="work-step">
            <h3>Investment & Savings</h3>
            <p>Grow your wealth with our investment plans, high-yield savings, and financial advisory services.</p>
          </div>
          <div className="work-step">
            <h3>Business Banking</h3>
            <p>Customized banking solutions for businesses, including payroll management and business loans.</p>
          </div>
          <div className="work-step">
            <h3>Loan & Credit Facilities</h3>
            <p>Get quick personal or business loans with flexible repayment terms.</p>
          </div>
          <div className="work-step">
            <h3>Customer Support</h3>
            <p>Our support team is available 24/7 via phone, email, and live chat.</p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="services">
        <h2>Our Services</h2>
        <div className="service-items">
          <div className="service-item">
            <img
              src="https://images.unsplash.com/photo-1563013544-824ae1b704d3"
              alt="Online Banking"
              className="service-image"
            />
            <h3>Online Banking</h3>
            <p>Manage your accounts anytime, anywhere with our secure online banking platform.</p>
          </div>
          <div className="service-item">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
              alt="Investments"
              className="service-image"
            />
            <h3>Investment Plans</h3>
            <p>Explore a variety of investment opportunities to grow your wealth efficiently.</p>
          </div>
          <div className="service-item">
            <img
              src="https://media.istockphoto.com/id/2021524839/photo/business-finance-and-investment-analyze-economic-growth-charts-for-informed-business-finance.jpg?s=1024x1024&w=is&k=20&c=PeQLQa7XaEKeMhtzsWTdMTnk45Xs29ER-UQC4MHo_vU="
              alt="Loans"
              className="service-image"
            />
            <h3>Loan Services</h3>
            <p>Apply for personal, business, or mortgage loans with quick approvals.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-items">
          <div className="testimonial-item">
            <p>"Modern Bank has been a great financial partner for our family. We've been able to save money, invest, and grow our wealth together."</p>
            <strong>— Jane Doe, Parent</strong>
          </div>
          <div className="testimonial-item">
            <p>"The loan process was so fast and easy! I got my approval within hours, and the rates were very reasonable."</p>
            <strong>— Mark Johnson, Small Business Owner</strong>
          </div>
          <div className="testimonial-item">
            <p>"I love how secure and user-friendly the online banking platform is. Managing my finances has never been easier!"</p>
            <strong>— Sarah Lee, Freelancer</strong>
          </div>
          <div className="testimonial-item">
            <p>"24/7 customer service has been a lifesaver. I always get the help I need, no matter the time of day."</p>
            <strong>— Daniel Kim, Entrepreneur</strong>
          </div>
          <div className="testimonial-item">
            <p>"The investment advice I received helped me double my savings in just one year! Highly recommend Modern Bank."</p>
            <strong>— Emily Carter, Investor</strong>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WelcomePage;