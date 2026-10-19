import { Link } from 'react-router-dom';
import { HiLocationMarker, HiHeart, HiOutlineHeart, HiShieldCheck, HiPhone, HiCheckCircle } from 'react-icons/hi';
import { IoBedOutline, IoWaterOutline, IoResizeOutline, IoLogoWhatsapp } from 'react-icons/io5';
import './PropertyCard.css';

const PropertyCard = ({ property, isFavorited, onToggleFavorite, index = 0 }) => {
  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const calculatePricePerSqft = (price, area) => {
    if (!area || area === 0) return null;
    const rate = Math.round(price / area);
    return `₹${rate.toLocaleString('en-IN')}/sq.ft`;
  };

  const placeholderImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=420&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=420&fit=crop',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=420&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=420&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=420&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=420&fit=crop',
  ];

  const imageUrl = property.images?.[0] || placeholderImages[index % placeholderImages.length];
  const sqftRate = calculatePricePerSqft(property.price, property.area);

  return (
    <div className="human-property-card animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
      {/* Photo Header */}
      <div className="card-media">
        <Link to={`/property/${property._id}`}>
          <img src={imageUrl} alt={property.title} loading="lazy" className="card-img" />
        </Link>
        
        <div className="card-badges-top">
          <span className="badge-tag RERA">
            <HiShieldCheck /> RERA Approved
          </span>
          {property.featured && <span className="badge-tag featured">Featured</span>}
        </div>

        <div className="card-photo-count">
          📷 {8 + (index % 5)} Photos
        </div>

        {onToggleFavorite && (
          <button
            className={`favorite-icon-btn ${isFavorited ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onToggleFavorite(property._id); }}
            aria-label="Save property"
          >
            {isFavorited ? <HiHeart /> : <HiOutlineHeart />}
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="card-body">
        {/* Price Tag */}
        <div className="price-row">
          <div className="main-price">{formatPrice(property.price)}</div>
          {sqftRate && <div className="sqft-rate">{sqftRate}</div>}
        </div>

        {/* Title */}
        <Link to={`/property/${property._id}`} className="card-title-link">
          <h3 className="card-title">{property.title}</h3>
        </Link>

        {/* Location */}
        <div className="card-location">
          <HiLocationMarker className="loc-icon" />
          <span>{property.location?.city || 'Mumbai'}, {property.location?.state || 'Maharashtra'}</span>
        </div>

        {/* Specs Row */}
        <div className="card-specs">
          {property.type !== 'plot' && (
            <>
              <div className="spec-item">
                <IoBedOutline />
                <span>{property.bedrooms || 3} BHK</span>
              </div>
              <div className="spec-item">
                <IoWaterOutline />
                <span>{property.bathrooms || 2} Baths</span>
              </div>
            </>
          )}
          <div className="spec-item">
            <IoResizeOutline />
            <span>{property.area || 1800} sq.ft</span>
          </div>
        </div>

        {/* Verified Owner / Broker Footer */}
        <div className="card-footer-row">
          <div className="seller-info">
            <HiCheckCircle className="verified-check" />
            <span>Verified Owner</span>
          </div>

          <div className="card-actions">
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="action-btn whatsapp" title="Chat on WhatsApp">
              <IoLogoWhatsapp />
            </a>
            <a href="tel:18001234567" className="action-btn call" title="Call Agent">
              <HiPhone /> Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
