import React from 'react';
import './Footer.css';
import { FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-text">
          <p>Created by Shikhkarim</p>
        </div>
        <div className="footer-social">
          <a href="https://www.linkedin.com/in/shikhkarim" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
