import React from 'react'
import { Link } from 'react-router-dom'
import { Linkedin, Instagram } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="new-footer">
      <div className="footer-container">
        {/* Top Section - Logo and Know Your Team */}
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo-container">
              <img src="/asset/cloudnexus-logo.png" alt="CloudNexus" className="footer-logo-image" />
            </div>
            <span className="footer-brand-text">CLOUDNEXUS</span>
          </div>
          
          <div className="footer-separator"></div>
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="footer-kyt-link"
          >
            Know Your Team
          </button>
        </div>

        {/* Bottom Section - Social Media Icons */}
        <div className="footer-bottom">
          <div className="footer-social-icons">
            <a 
              href="https://www.linkedin.com/company/cloudnexusorg/?viewAsMember=true" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            
            <a 
              href="https://www.instagram.com/cloudnexus.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer