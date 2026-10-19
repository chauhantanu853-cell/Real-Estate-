import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  HiHome, 
  HiSearch, 
  HiHeart, 
  HiMenu, 
  HiX, 
  HiLogout, 
  HiUser, 
  HiChevronDown, 
  HiPhone, 
  HiLocationMarker, 
  HiShieldCheck, 
  HiPlus 
} from 'react-icons/hi';
import { BsBuildings } from 'react-icons/bs';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [buyDropdown, setBuyDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [cityDropdown, setCityDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'seller') return '/seller';
    return '/buyer-dashboard';
  };

  const isActive = (path) => location.pathname === path;

  const cities = ['Mumbai', 'Bengaluru', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai'];

  return (
    <header className="navbar-wrapper">
      {/* Top Utility Bar */}
      <div className="top-bar">
        <div className="container top-bar-container">
          <div className="top-bar-left">
            <span className="top-bar-item">
              <HiShieldCheck className="icon-emerald" /> 100% RERA Verified & Direct Owner Listings
            </span>
            <span className="top-bar-divider">|</span>
            <div className="city-selector">
              <HiLocationMarker className="icon-blue" />
              <span>City: </span>
              <button 
                className="city-btn" 
                onClick={() => setCityDropdown(!cityDropdown)}
              >
                <strong>{selectedCity}</strong> <HiChevronDown />
              </button>
              {cityDropdown && (
                <div className="city-dropdown-menu">
                  {cities.map((city) => (
                    <div 
                      key={city} 
                      className={`city-item ${selectedCity === city ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityDropdown(false);
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="top-bar-right">
            <a href="tel:18001234567" className="top-bar-phone">
              <HiPhone /> Toll Free: 1800-123-4567
            </a>
            <span className="top-bar-divider">|</span>
            <Link to="/seller" className="top-bar-link">Seller Hub</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="navbar" id="main-navbar">
        <div className="container navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo" id="nav-logo">
            <div className="logo-icon">
              <BsBuildings />
            </div>
            <div className="logo-text-wrapper">
              <span className="logo-brand">DreamHome</span>
              <span className="logo-tagline">Real Estate Portal</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className={`navbar-menu ${mobileOpen ? 'active' : ''}`}>
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <HiHome /> Home
            </Link>

            <div
              className="nav-dropdown"
              onMouseEnter={() => setBuyDropdown(true)}
              onMouseLeave={() => setBuyDropdown(false)}
            >
              <Link 
                to="/buy" 
                className={`nav-link ${location.pathname.startsWith('/buy') ? 'active' : ''}`}
                onClick={() => { setBuyDropdown(false); setMobileOpen(false); }}
              >
                Buy Property <HiChevronDown />
              </Link>
              {buyDropdown && (
                <div className="dropdown-menu">
                  <Link to="/buy?type=house" className="dropdown-item" onClick={() => { setBuyDropdown(false); setMobileOpen(false); }}>Independent Houses</Link>
                  <Link to="/buy?type=flat" className="dropdown-item" onClick={() => { setBuyDropdown(false); setMobileOpen(false); }}>Luxury Apartments</Link>
                  <Link to="/buy?type=shop" className="dropdown-item" onClick={() => { setBuyDropdown(false); setMobileOpen(false); }}>Commercial Shops</Link>
                  <Link to="/buy?type=plot" className="dropdown-item" onClick={() => { setBuyDropdown(false); setMobileOpen(false); }}>Residential Plots</Link>
                </div>
              )}
            </div>

            <Link
              to="/ai-search"
              className={`nav-link ${isActive('/ai-search') ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <HiSearch /> Property Search
            </Link>

            {user && (
              <Link
                to="/favorites"
                className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <HiHeart /> Saved
              </Link>
            )}
          </div>

          {/* Actions Bar */}
          <div className="navbar-actions">
            <Link to="/seller" className="btn btn-emerald btn-sm post-property-btn">
              <HiPlus /> Post Property <span className="free-badge">FREE</span>
            </Link>

            {user ? (
              <div className="user-menu" id="user-menu">
                <button
                  className="user-menu-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{user.name}</span>
                  <HiChevronDown />
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <span className="dropdown-email">{user.email}</span>
                      <span className={`badge badge-${user.role === 'admin' ? 'rose' : user.role === 'seller' ? 'cyan' : 'emerald'}`}>
                        {user.role}
                      </span>
                    </div>
                    <Link
                      to={getDashboardLink()}
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <HiUser /> Dashboard
                    </Link>
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <HiLogout /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              id="mobile-menu-toggle"
            >
              {mobileOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
