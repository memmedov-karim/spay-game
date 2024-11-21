import React from 'react';
import './Footer.css';
import { FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="spy-footer">
      <div className="spy-footer-content">
        <div className="spy-footer-text">
          <p>Created by <span>Shikhkarim</span></p>
          {/* Added phone number below the creator's name */}
          <p className="spy-footer-phone">Contact: <span>+994-70-238-8838</span></p>
        </div>
        <div className="spy-footer-social">
          <a
            href="https://www.linkedin.com/in/shikhkarim"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
