import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties, toggleFavorite, getFavorites } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import PropertyCard from '../components/PropertyCard';
import { HiFilter, HiX, HiSearch, HiCheck } from 'react-icons/hi';
import './BuyProperty.css';

const BuyProperty = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    search: searchParams.get('search') || '',
  });

  // Sync state with URL search parameters on route/search change
  useEffect(() => {
    const typeFromUrl = searchParams.get('type') || '';
    const cityFromUrl = searchParams.get('city') || '';
    const searchFromUrl = searchParams.get('search') || '';
    setFilters(prev => ({
      ...prev,
      type: typeFromUrl,
      city: cityFromUrl,
      search: searchFromUrl,
    }));
  }, [searchParams]);

  const demoProperties = [
    { _id: '1', title: 'Luxury 4BHK Sea View Villa in Juhu', type: 'house', price: 28500000, area: 3800, bedrooms: 4, bathrooms: 4, location: { city: 'Mumbai', state: 'Maharashtra' }, featured: true },
    { _id: '2', title: 'Modern 3BHK Flat in Koramangala', type: 'flat', price: 9200000, area: 1850, bedrooms: 3, bathrooms: 2, location: { city: 'Bangalore', state: 'Karnataka' }, featured: true },
    { _id: '3', title: 'Prime Commercial Shop in Connaught Place', type: 'shop', price: 14000000, area: 1250, bedrooms: 0, bathrooms: 1, location: { city: 'Delhi', state: 'Delhi' } },
    { _id: '4', title: 'Corner Residential Plot Sector 62', type: 'plot', price: 4800000, area: 2400, bedrooms: 0, bathrooms: 0, location: { city: 'Noida', state: 'UP' } },
    { _id: '5', title: 'Sea-View Luxury Penthouse', type: 'flat', price: 38000000, area: 4500, bedrooms: 5, bathrooms: 5, location: { city: 'Mumbai', state: 'Maharashtra' }, featured: true },
    { _id: '6', title: 'Cozy Independent Family Home', type: 'house', price: 6800000, area: 2100, bedrooms: 3, bathrooms: 3, location: { city: 'Pune', state: 'Maharashtra' } },
    { _id: '7', title: 'Studio Apartment near Tech Park', type: 'flat', price: 3500000, area: 700, bedrooms: 1, bathrooms: 1, location: { city: 'Bangalore', state: 'Karnataka' } },
    { _id: '8', title: 'Commercial Office Space MG Road', type: 'shop', price: 19500000, area: 2200, bedrooms: 0, bathrooms: 2, location: { city: 'Bangalore', state: 'Karnataka' } },
    { _id: '9', title: 'Agricultural Farm Land Plot', type: 'plot', price: 8200000, area: 5500, bedrooms: 0, bathrooms: 0, location: { city: 'Hyderabad', state: 'Telangana' } },
  ];

  useEffect(() => {
    loadProperties();
    if (user) loadFavorites();
  }, [page, searchParams, sortBy]);

  const loadProperties = async () => {
    setLoading(true);
    const activeType = searchParams.get('type') || '';
    const activeCity = searchParams.get('city') || '';
    const activeSearch = searchParams.get('search') || '';

    try {
      const params = { page, limit: 9 };
      if (activeType) params.type = activeType;
      if (activeCity) params.city = activeCity;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (activeSearch) params.search = activeSearch;

      const { data } = await getProperties(params);
      let fetchedProps = data.properties || [];
      
      // Client sort if needed
      if (sortBy === 'price-low') fetchedProps.sort((a, b) => a.price - b.price);
      else if (sortBy === 'price-high') fetchedProps.sort((a, b) => b.price - a.price);

      setProperties(fetchedProps);
      setTotal(data.total || fetchedProps.length);
      setPages(data.pages || 1);
    } catch {
      let filtered = [...demoProperties];
      if (activeType) filtered = filtered.filter(p => p.type === activeType);
      if (activeCity) filtered = filtered.filter(p => p.location.city.toLowerCase().includes(activeCity.toLowerCase()));
      if (filters.minPrice) filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
      if (filters.maxPrice) filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
      if (filters.bedrooms) filtered = filtered.filter(p => p.bedrooms >= Number(filters.bedrooms));
      if (activeSearch) {
        const s = activeSearch.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.location.city.toLowerCase().includes(s));
      }
      
      if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
      else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);

      setProperties(filtered);
      setTotal(filtered.length);
    }
    setLoading(false);
  };

  const loadFavorites = async () => {
    try {
      const { data } = await getFavorites();
      setFavorites(data.map(f => f.property?._id));
    } catch { }
  };

  const handleToggleFavorite = async (propertyId) => {
    if (!user) return;
    try {
      await toggleFavorite(propertyId);
      setFavorites(prev =>
        prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
      );
    } catch { }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.city) params.city = filters.city;
    if (filters.search) params.search = filters.search;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ type: '', city: '', minPrice: '', maxPrice: '', bedrooms: '', search: '' });
    setSearchParams({});
    setPage(1);
  };

  const getPageTitle = () => {
    const activeType = searchParams.get('type') || filters.type;
    const activeCity = searchParams.get('city') || filters.city;

    if (activeType) {
      const typeLabels = {
        house: 'Independent Houses & Villas',
        flat: 'Luxury Apartments & Flats',
        shop: 'Commercial Shops & Offices',
        plot: 'Residential Plots & Land'
      };
      return typeLabels[activeType] || 'Verified Properties';
    }
    if (activeCity) return `Properties in ${activeCity}`;
    return 'All Verified Properties';
  };

  return (
    <div className="buy-page-wrapper">
      <div className="container">
        {/* Page Header */}
        <div className="buy-page-header">
          <div>
            <h1 className="buy-page-title">
              {getPageTitle()}
            </h1>
            <p className="buy-page-subtitle">
              {total > 0 ? `Showing ${total} verified property listings` : 'Explore available residential & commercial listings'}
            </p>
          </div>

          <div className="buy-header-actions">
            <div className="sort-select-wrapper">
              <label>Sort By:</label>
              <select className="form-input sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            <button className="btn btn-secondary filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
              <HiFilter /> Filters
            </button>
          </div>
        </div>

        {/* Content Layout: Sidebar + Grid */}
        <div className="buy-layout">
          {/* Filter Sidebar */}
          <aside className={`filter-sidebar ${showFilters ? 'mobile-active' : ''}`}>
            <div className="sidebar-header">
              <h3><HiFilter /> Filter Properties</h3>
              <button className="close-filter-btn" onClick={() => setShowFilters(false)}><HiX /></button>
            </div>

            <form onSubmit={handleFilterSubmit} className="filter-form">
              <div className="filter-block">
                <label>Property Type</label>
                <select 
                  className="form-input" 
                  value={filters.type} 
                  onChange={(e) => {
                    const newType = e.target.value;
                    setFilters({...filters, type: newType});
                    const params = {};
                    if (newType) params.type = newType;
                    if (filters.city) params.city = filters.city;
                    if (filters.search) params.search = filters.search;
                    setSearchParams(params);
                  }}
                >
                  <option value="">All Types</option>
                  <option value="flat">Apartment / Flat</option>
                  <option value="house">Independent Villa / House</option>
                  <option value="shop">Commercial Shop</option>
                  <option value="plot">Plot / Land</option>
                </select>
              </div>

              <div className="filter-block">
                <label>City</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Mumbai, Pune" 
                  value={filters.city} 
                  onChange={(e) => setFilters({...filters, city: e.target.value})} 
                />
              </div>

              <div className="filter-block">
                <label>Bedrooms (BHK)</label>
                <div className="bhk-options-grid">
                  {['1', '2', '3', '4+'].map((bhk) => (
                    <button
                      type="button"
                      key={bhk}
                      className={`bhk-chip ${filters.bedrooms === bhk ? 'active' : ''}`}
                      onClick={() => setFilters({...filters, bedrooms: filters.bedrooms === bhk ? '' : bhk})}
                    >
                      {bhk} BHK
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-block">
                <label>Budget Range (₹)</label>
                <div className="price-inputs-row">
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="Min Price" 
                    value={filters.minPrice} 
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})} 
                  />
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="Max Price" 
                    value={filters.maxPrice} 
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} 
                  />
                </div>
              </div>

              <div className="filter-block">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>RERA Verified Only</span>
                </label>
              </div>

              <div className="filter-form-actions">
                <button type="submit" className="btn btn-primary w-100"><HiSearch /> Apply Filters</button>
                <button type="button" className="btn btn-secondary w-100" onClick={clearFilters}>Reset Filters</button>
              </div>
            </form>
          </aside>

          {/* Property Grid Content */}
          <main className="property-grid-area">
            {loading ? (
              <div className="loading-container"><div className="spinner"></div></div>
            ) : properties.length > 0 ? (
              <>
                <div className="grid-3">
                  {properties.map((property, i) => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      index={i}
                      isFavorited={favorites.includes(property._id)}
                      onToggleFavorite={user ? handleToggleFavorite : undefined}
                    />
                  ))}
                </div>

                {pages > 1 && (
                  <div className="pagination-bar">
                    {[...Array(pages)].map((_, i) => (
                      <button 
                        key={i} 
                        className={`pagination-num ${page === i + 1 ? 'active' : ''}`} 
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="empty-results-box">
                <div className="empty-icon">🏠</div>
                <h3>No matching properties found</h3>
                <p>Try adjusting your city, budget range, or property type filters.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear All Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BuyProperty;
