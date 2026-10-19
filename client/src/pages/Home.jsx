import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { 
  HiSearch, 
  HiShieldCheck, 
  HiCurrencyRupee, 
  HiStar, 
  HiUserGroup, 
  HiLocationMarker, 
  HiPhone, 
  HiSparkles,
  HiCheckCircle,
  HiHome,
  HiOfficeBuilding
} from 'react-icons/hi';
import { BsBuildings, BsHouseDoor, BsShop, BsGrid } from 'react-icons/bs';
import { IoLogoWhatsapp } from 'react-icons/io5';
import './Home.css';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [searchTab, setSearchTab] = useState('buy');
  const [cityFilter, setCityFilter] = useState('Mumbai');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const { data } = await getProperties({ limit: 6 });
        setFeaturedProperties(data.properties || []);
      } catch {
        setFeaturedProperties(getDemoProperties());
      }
    };
    loadFeatured();
  }, []);

  const getDemoProperties = () => [
    { _id: '1', title: 'Luxury 4BHK Sea View Villa', type: 'house', price: 28500000, area: 3800, bedrooms: 4, bathrooms: 4, location: { city: 'Mumbai', state: 'Maharashtra' }, featured: true },
    { _id: '2', title: 'Modern 3BHK Apartment in Koramangala', type: 'flat', price: 9200000, area: 1850, bedrooms: 3, bathrooms: 2, location: { city: 'Bangalore', state: 'Karnataka' }, featured: true },
    { _id: '3', title: 'Prime Retail Commercial Shop', type: 'shop', price: 14000000, area: 1250, bedrooms: 0, bathrooms: 1, location: { city: 'Delhi', state: 'Delhi' }, featured: false },
    { _id: '4', title: 'Corner Residential Plot in Sector 62', type: 'plot', price: 4800000, area: 2400, bedrooms: 0, bathrooms: 0, location: { city: 'Noida', state: 'UP' }, featured: true },
    { _id: '5', title: 'Penthouse with Private Terrace', type: 'flat', price: 38000000, area: 4500, bedrooms: 5, bathrooms: 5, location: { city: 'Mumbai', state: 'Maharashtra' }, featured: true },
    { _id: '6', title: 'Spacious Independent Family Home', type: 'house', price: 6800000, area: 2100, bedrooms: 3, bathrooms: 3, location: { city: 'Pune', state: 'Maharashtra' }, featured: false },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    let url = `/buy?city=${encodeURIComponent(cityFilter)}`;
    if (typeFilter) url += `&type=${typeFilter}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    navigate(url);
  };

  const topCities = [
    { name: 'Mumbai', count: '14,200+ Properties', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=280&fit=crop' },
    { name: 'Bengaluru', count: '11,500+ Properties', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=280&fit=crop' },
    { name: 'Delhi NCR', count: '9,800+ Properties', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=280&fit=crop' },
    { name: 'Pune', count: '7,400+ Properties', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=280&fit=crop' },
  ];

  const categories = [
    { type: 'flat', label: 'Apartments / Flats', icon: <BsBuildings />, count: '18,500+ Listings' },
    { type: 'house', label: 'Villas & Houses', icon: <BsHouseDoor />, count: '8,200+ Listings' },
    { type: 'shop', label: 'Commercial Shops', icon: <BsShop />, count: '5,400+ Listings' },
    { type: 'plot', label: 'Residential Plots', icon: <BsGrid />, count: '4,100+ Listings' },
  ];

  const trustPoints = [
    { icon: <HiShieldCheck />, title: 'RERA Approved Properties', desc: '100% legally verified property listings with clear titles.' },
    { icon: <HiCurrencyRupee />, title: '0% Brokerage Options', desc: 'Connect directly with owners and save lakhs on brokerage.' },
    { icon: <HiUserGroup />, title: 'Expert Local Advisors', desc: 'Personalized property tour assistance and negotiation guidance.' },
    { icon: <HiCheckCircle />, title: 'Instant Home Loan Pre-approval', desc: 'Partnered with top banks offering pre-approved competitive interest rates.' }
  ];

  const advisors = [
    { name: 'Vikram Malhotra', role: 'Senior Property Specialist', city: 'Mumbai', phone: '+91 98200 11223', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop' },
    { name: 'Ananya Deshmukh', role: 'Luxury Real Estate Advisor', city: 'Bengaluru', phone: '+91 98450 33445', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop' },
    { name: 'Rajesh Verma', role: 'Commercial & Plot Expert', city: 'Delhi NCR', phone: '+91 98110 55667', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop' }
  ];

  const testimonials = [
    { name: 'Rajiv & Sneha Mehta', location: 'Bought 3BHK in Bandra, Mumbai', text: 'DreamHome made our home buying process completely transparent. verified legal documents gave us complete peace of mind!', rating: 5 },
    { name: 'Karan Sharma', location: 'Sold Apartment in HSR Layout', text: 'I posted my flat on DreamHome and got a verified buyer within 10 days. Zero hassle and zero unnecessary broker calls.', rating: 5 },
    { name: 'Pooja Hegde', location: 'Invested in Plot in Pune', text: 'The price per sq.ft estimator and neighborhood insights helped me make the right investment choice.', rating: 5 },
  ];

  return (
    <div className="home-container">
      {/* ===== HERO SECTION ===== */}
      <section className="human-hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-trust-tag animate-fade-in">
            <HiSparkles /> India's Most Trusted Property Portal
          </div>
          <h1 className="hero-title animate-fade-in-up">
            Find Real Estate Properties That Fit Your Lifestyle
          </h1>
          <p className="hero-subtitle animate-fade-in-up">
            Explore 50,000+ RERA-verified apartments, luxury villas, commercial spaces, and residential plots.
          </p>

          {/* Search Box */}
          <div className="hero-search-box animate-fade-in-up">
            <div className="search-tabs">
              <button className={`tab-btn ${searchTab === 'buy' ? 'active' : ''}`} onClick={() => setSearchTab('buy')}>
                <HiHome /> Buy Property
              </button>
              <button className={`tab-btn ${searchTab === 'commercial' ? 'active' : ''}`} onClick={() => setSearchTab('commercial')}>
                <BsShop /> Commercial
              </button>
            </div>

            <form className="search-fields-grid" onSubmit={handleSearch}>
              <div className="field-group">
                <label>City</label>
                <select className="field-select" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bengaluru</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              <div className="field-group">
                <label>Property Type</label>
                <select className="field-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="">All Types</option>
                  <option value="flat">Apartment / Flat</option>
                  <option value="house">Villa / House</option>
                  <option value="shop">Commercial Shop</option>
                  <option value="plot">Plot / Land</option>
                </select>
              </div>

              <div className="field-group flex-2">
                <label>Locality or Keyword</label>
                <input
                  type="text"
                  placeholder="e.g. Bandra West, Koramangala, 3BHK..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="field-input"
                />
              </div>

              <button type="submit" className="search-submit-btn">
                <HiSearch /> Search
              </button>
            </form>
          </div>

          <div className="popular-keywords">
            <span>Trending Searches:</span>
            <Link to="/buy?city=Mumbai&type=flat">3BHK Flats in Mumbai</Link>
            <Link to="/buy?city=Bangalore&type=house">Villas in Bengaluru</Link>
            <Link to="/buy?city=Delhi&type=shop">Shops in CP Delhi</Link>
          </div>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className="stats-strip">
        <div className="container stats-strip-grid">
          <div className="strip-item">
            <div className="strip-num">50,000+</div>
            <div className="strip-text">Active Property Listings</div>
          </div>
          <div className="strip-item">
            <div className="strip-num">25,000+</div>
            <div className="strip-text">Happy Homeowners</div>
          </div>
          <div className="strip-item">
            <div className="strip-num">120+</div>
            <div className="strip-text">Cities Across India</div>
          </div>
          <div className="strip-item">
            <div className="strip-num">₹0</div>
            <div className="strip-text">Brokerage on Owner Properties</div>
          </div>
        </div>
      </section>

      {/* ===== TOP CITIES SECTION ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Explore Properties by Top Cities</h2>
              <p className="section-subtitle">Find prime real estate listings in India's leading metro cities</p>
            </div>
          </div>
          <div className="grid-4">
            {topCities.map((city, i) => (
              <Link to={`/buy?city=${encodeURIComponent(city.name)}`} key={i} className="city-card">
                <img src={city.image} alt={city.name} className="city-card-img" />
                <div className="city-card-overlay">
                  <h3>{city.name}</h3>
                  <p>{city.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section bg-light-gray">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Property Types</h2>
            <p className="section-subtitle">Browse through specialized categories tailored to your requirement</p>
          </div>
          <div className="grid-4 category-cards-grid">
            {categories.map((cat) => (
              <Link to={`/buy?type=${cat.type}`} key={cat.type} className="cat-card">
                <div className="cat-icon">{cat.icon}</div>
                <h3>{cat.label}</h3>
                <p>{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROPERTIES ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Handpicked Premium Listings</h2>
              <p className="section-subtitle">RERA verified properties with high ROI and prime locations</p>
            </div>
            <Link to="/buy" className="btn btn-secondary">Explore All Properties →</Link>
          </div>
          <div className="grid-3">
            {(featuredProperties.length > 0 ? featuredProperties : getDemoProperties()).map((property, i) => (
              <PropertyCard key={property._id} property={property} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US (TRUST & SECURITY) ===== */}
      <section className="section bg-light-gray">
        <div className="container">
          <div className="text-center mb-50">
            <h2 className="section-title">Why 50,000+ Buyers Choose DreamHome</h2>
            <p className="section-subtitle">We remove friction from real estate transactions with authentic trust standards</p>
          </div>
          <div className="grid-4 trust-grid">
            {trustPoints.map((item, i) => (
              <div key={i} className="trust-card">
                <div className="trust-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXPERT ADVISORS SECTION ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Talk to Our Real Estate Specialists</h2>
              <p className="section-subtitle">Get professional advice on property valuation, site visits, and legal documentation</p>
            </div>
          </div>
          <div className="grid-3 advisors-grid">
            {advisors.map((adv, i) => (
              <div key={i} className="advisor-card">
                <img src={adv.image} alt={adv.name} className="advisor-img" />
                <div className="advisor-details">
                  <h3>{adv.name}</h3>
                  <div className="advisor-role">{adv.role}</div>
                  <div className="advisor-city"><HiLocationMarker /> {adv.city}</div>
                  <div className="advisor-actions">
                    <a href={`tel:${adv.phone}`} className="btn btn-secondary btn-sm"><HiPhone /> Call</a>
                    <a href="https://wa.me/919820011223" target="_blank" rel="noreferrer" className="btn btn-emerald btn-sm"><IoLogoWhatsapp /> Chat</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section bg-light-gray">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Verified Customer Reviews</h2>
            <p className="section-subtitle">Real feedback from buyers, sellers, and investors across India</p>
          </div>
          <div className="grid-3 testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-human-card">
                <div className="rating-stars">
                  {[...Array(t.rating)].map((_, j) => <HiStar key={j} />)}
                </div>
                <p className="testimonial-quote">"{t.text}"</p>
                <div className="testimonial-user">
                  <div className="user-avatar-placeholder">{t.name.charAt(0)}</div>
                  <div>
                    <div className="user-name">{t.name}</div>
                    <div className="user-location">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-banner">
        <div className="container cta-flex">
          <div>
            <h2>Are You a Property Owner or Agent?</h2>
            <p>Post your property listing on DreamHome for FREE and reach thousands of verified buyers.</p>
          </div>
          <div className="cta-buttons-row">
            <Link to="/seller" className="btn btn-emerald btn-lg">Post Property FREE</Link>
            <Link to="/register" className="btn btn-dark btn-lg">Create Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
