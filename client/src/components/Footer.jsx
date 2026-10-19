import { Link } from 'react-router-dom';
import { BsBuildings } from 'react-icons/bs';
import { HiMail, HiPhone, HiLocationMarker, HiShieldCheck } from 'react-icons/hi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon"><BsBuildings /></div>
              <div className="logo-text-wrapper">
                <span className="logo-brand">DreamHome</span>
                <span className="logo-tagline">Real Estate Portal</span>
              </div>
            </Link>
            <p className="footer-desc">
              India's premier real estate platform connecting buyers, owners, and verified agents for residential & commercial properties.
            </p>
            <div className="footer-trust-badge">
              <HiShieldCheck /> RERA Registered Portal
            </div>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" className="social-link" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className="social-link" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className="social-link" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </div>

          {/* Popular Cities */}
          <div className="footer-section">
            <h4 className="footer-title">Popular Cities</h4>
            <Link to="/buy?city=Mumbai" className="footer-link">Properties in Mumbai</Link>
            <Link to="/buy?city=Bangalore" className="footer-link">Properties in Bengaluru</Link>
            <Link to="/buy?city=Delhi" className="footer-link">Properties in Delhi NCR</Link>
            <Link to="/buy?city=Pune" className="footer-link">Properties in Pune</Link>
            <Link to="/buy?city=Hyderabad" className="footer-link">Properties in Hyderabad</Link>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/buy" className="footer-link">Buy Property</Link>
            <Link to="/seller" className="footer-link">Post Property FREE</Link>
            <Link to="/ai-search" className="footer-link">Property Search</Link>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-title">Corporate Support</h4>
            <div className="footer-contact">
              <HiLocationMarker />
              <span>Tower 3, Business Park, BKC, Mumbai, Maharashtra 400051</span>
            </div>
            <div className="footer-contact">
              <HiMail />
              <span>support@dreamhome.com</span>
            </div>
            <div className="footer-contact">
              <HiPhone />
              <span>Toll Free: 1800-123-4567</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} DreamHome Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">RERA Compliance</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
