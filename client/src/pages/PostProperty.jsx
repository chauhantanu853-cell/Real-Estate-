import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createProperty, getMyProperties, deleteProperty } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { 
  HiPlus, 
  HiCheck, 
  HiTrash, 
  HiSparkles, 
  HiLocationMarker, 
  HiCurrencyRupee, 
  HiOfficeBuilding, 
  HiPhotograph,
  HiShieldCheck
} from 'react-icons/hi';
import './PostProperty.css';

const presetImages = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
];

const availableAmenities = [
  "Swimming Pool", "Gym", "Elevator", "Power Backup", 
  "Gated Security", "Garden", "Parking", "Air Conditioning",
  "Clubhouse", "Fire Alarm", "24/7 Access", "Water Connection"
];

const PostProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'flat',
    price: '',
    area: '',
    bedrooms: '2',
    bathrooms: '2',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '',
    imageUrl: presetImages[0],
    amenities: ['Power Backup', 'Security'],
  });

  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      fetchMyListings();
    }
  }, [user]);

  const fetchMyListings = async () => {
    try {
      const { data } = await getMyProperties();
      setMyProperties(data || []);
    } catch {
      // Fallback
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description || 'Verified property for sale on DreamHome.',
        type: formData.type,
        price: Number(formData.price),
        area: Number(formData.area),
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        amenities: formData.amenities,
        images: [formData.imageUrl || presetImages[0]]
      };

      await createProperty(payload);
      setSuccessMsg('🎉 Property posted successfully! It is now live on DreamHome.');
      
      // Reset form title and price
      setFormData(prev => ({
        ...prev,
        title: '',
        price: '',
        area: '',
        description: ''
      }));

      fetchMyListings();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to post property. Please check required fields.');
    }
    setLoading(false);
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await deleteProperty(id);
      setMyProperties(prev => prev.filter(p => p._id !== id));
    } catch {
      alert('Failed to delete property');
    }
  };

  // Preview object
  const previewProperty = {
    _id: 'preview',
    title: formData.title || 'Your Property Title Will Appear Here',
    type: formData.type,
    price: formData.price ? Number(formData.price) : 7500000,
    area: formData.area ? Number(formData.area) : 1500,
    bedrooms: Number(formData.bedrooms) || 2,
    bathrooms: Number(formData.bathrooms) || 2,
    location: {
      city: formData.city || 'Mumbai',
      state: formData.state || 'Maharashtra'
    },
    images: [formData.imageUrl || presetImages[0]],
    featured: true
  };

  if (!user) {
    return (
      <div className="seller-page-wrapper">
        <div className="container">
          <div className="seller-auth-prompt animate-fade-in-up">
            <h2>Post Your Property for FREE</h2>
            <p>Reach 50,000+ buyers with 0% brokerage on DreamHome.</p>
            <div className="auth-buttons" style={{ justifyContent: 'center', gap: '12px' }}>
              <Link to="/login" className="btn btn-primary btn-lg">Sign In to Post</Link>
              <Link to="/register" className="btn btn-secondary btn-lg">Create Free Account</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-page-wrapper">
      <div className="container">
        {/* Page Header */}
        <div className="seller-page-header">
          <h1 className="seller-page-title">Seller Hub & Property Listing</h1>
          <p className="seller-page-subtitle">Fill in property details below to list your home or commercial space for free.</p>
        </div>

        {successMsg && (
          <div className="post-success-toast animate-fade-in-up">
            <HiShieldCheck style={{ fontSize: '1.4rem' }} />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="auth-error animate-fade-in-up" style={{ marginBottom: '24px' }}>
            {errorMsg}
          </div>
        )}

        <div className="post-property-grid">
          {/* Main Form */}
          <div className="form-card">
            <form onSubmit={handleSubmit} id="post-property-form">
              {/* Basic Info */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <HiOfficeBuilding className="icon-blue" /> Basic Property Info
                </h3>

                <div className="form-group">
                  <label>Property Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Spacious 3BHK Flat with Balcony in Bandra"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    id="property-title-input"
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Property Type *</label>
                    <select
                      className="form-input"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      id="property-type-input"
                    >
                      <option value="flat">Apartment / Flat</option>
                      <option value="house">Independent Villa / House</option>
                      <option value="shop">Commercial Shop / Office</option>
                      <option value="plot">Residential Plot / Land</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Asking Price (₹) *</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 8500000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      min="1"
                      id="property-price-input"
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Carpet Area (sq. ft.) *</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 1450"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                      min="1"
                      id="property-area-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bedrooms (BHK)</label>
                    <select
                      className="form-input"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      id="property-bedrooms-input"
                    >
                      <option value="0">0 (N/A)</option>
                      <option value="1">1 BHK</option>
                      <option value="2">2 BHK</option>
                      <option value="3">3 BHK</option>
                      <option value="4">4+ BHK</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Bathrooms</label>
                    <select
                      className="form-input"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      id="property-bathrooms-input"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="form-section" style={{ marginTop: '24px' }}>
                <h3 className="form-section-title">
                  <HiLocationMarker className="icon-blue" /> Location Details
                </h3>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      id="property-city-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Maharashtra"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      id="property-state-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Full Address / Locality</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Flat 402, Sunshine Heights, 100 Feet Road"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    id="property-address-input"
                  />
                </div>
              </div>

              {/* Photos & Amenities */}
              <div className="form-section" style={{ marginTop: '24px' }}>
                <h3 className="form-section-title">
                  <HiPhotograph className="icon-blue" /> Photo & Amenities
                </h3>

                <div className="form-group">
                  <label>Property Photo Image URL</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    id="property-image-input"
                  />
                  <div style={{ marginTop: '8px' }}>
                    <small style={{ color: '#64748b' }}>Or select a sample photo preset:</small>
                    <div className="preset-images-row">
                      {presetImages.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Preset ${idx}`}
                          className={`preset-img-thumb ${formData.imageUrl === url ? 'active' : ''}`}
                          onClick={() => setFormData({ ...formData, imageUrl: url })}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Select Amenities</label>
                  <div className="amenities-selector-grid">
                    {availableAmenities.map((amenity) => {
                      const isSelected = formData.amenities.includes(amenity);
                      return (
                        <button
                          type="button"
                          key={amenity}
                          className={`amenity-chip-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleAmenityToggle(amenity)}
                        >
                          {isSelected && <HiCheck style={{ display: 'inline', marginRight: '4px' }} />}
                          {amenity}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Property Description</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Describe key features, nearby landmarks, security, ventilation..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    id="property-desc-input"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-emerald btn-lg w-100"
                style={{ marginTop: '24px' }}
                disabled={loading}
                id="post-property-submit"
              >
                <HiPlus /> {loading ? 'Posting Property...' : 'Submit & Post Property FREE'}
              </button>
            </form>
          </div>

          {/* Live Preview Sidebar */}
          <aside className="preview-sidebar">
            <div className="preview-title">
              <HiSparkles className="icon-blue" /> Live Listing Preview
            </div>
            <PropertyCard property={previewProperty} />
            <div style={{ marginTop: '16px', background: '#eff6ff', padding: '16px', borderRadius: '12px', color: '#1e40af', fontSize: '0.875rem' }}>
              <strong>💡 Seller Tip:</strong> Detailed titles with clear carpet area and photos receive up to 3x more buyer inquiries!
            </div>
          </aside>
        </div>

        {/* My Listed Properties */}
        {myProperties.length > 0 && (
          <div className="my-listings-section animate-fade-in-up">
            <div className="listings-header">
              <h2>My Posted Properties ({myProperties.length})</h2>
              <Link to="/buy" className="btn btn-secondary btn-sm">View All Site Properties →</Link>
            </div>

            {myProperties.map((prop) => (
              <div key={prop._id} className="my-listing-card">
                <div className="my-listing-info">
                  <img src={prop.images?.[0] || presetImages[0]} alt={prop.title} className="my-listing-img" />
                  <div className="my-listing-details">
                    <h4>{prop.title}</h4>
                    <p>₹{prop.price?.toLocaleString('en-IN')} • {prop.location?.city} • <span className="badge badge-emerald">Live</span></p>
                  </div>
                </div>
                <button
                  className="btn btn-rose btn-sm"
                  onClick={() => handleDeleteListing(prop._id)}
                  title="Delete Listing"
                >
                  <HiTrash /> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostProperty;
