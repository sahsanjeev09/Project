import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="quote-section">
        <img
          src="/aboutUsBanner.jpg" // Replace this with your image path or use import
          alt="Library background"
          className="quote-image"
        />
        <div className="quote-text">
          <h2>"He has the most, who is most content with the least."</h2>
          <p>― Lord Buddha</p>
        </div>
      </div>

      <div className="about-content">
        <h1>About Us</h1>
        <div className="about-boxes">
          <div className="about-box">
            <h3>Our Story</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="about-box">
            <h3>Our Mission</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="about-box">
            <h3>Our Team</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
