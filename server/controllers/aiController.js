const Property = require('../models/Property');

// @desc    AI-powered natural language property search
// @route   POST /api/ai/search
const aiSearch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: 'Please provide a search query' });
    }

    const lowerQuery = query.toLowerCase();

    // Parse natural language into filters
    const filter = { status: 'approved' };

    // Detect property type
    if (lowerQuery.includes('house') || lowerQuery.includes('home') || lowerQuery.includes('villa')) {
      filter.type = 'house';
    } else if (lowerQuery.includes('flat') || lowerQuery.includes('apartment')) {
      filter.type = 'flat';
    } else if (lowerQuery.includes('shop') || lowerQuery.includes('commercial') || lowerQuery.includes('store')) {
      filter.type = 'shop';
    } else if (lowerQuery.includes('plot') || lowerQuery.includes('land')) {
      filter.type = 'plot';
    }

    // Detect bedroom count
    const bedroomMatch = lowerQuery.match(/(\d+)\s*(bhk|bedroom|bed|room)/);
    if (bedroomMatch) {
      filter.bedrooms = { $gte: Number(bedroomMatch[1]) };
    }

    // Detect price range
    const budgetMatch = lowerQuery.match(/(\d+)\s*(lakh|lac|l)/i);
    if (budgetMatch) {
      const priceInLakhs = Number(budgetMatch[1]) * 100000;
      filter.price = { $lte: priceInLakhs };
    }
    const croreMatch = lowerQuery.match(/(\d+)\s*(crore|cr|c)/i);
    if (croreMatch) {
      const priceInCrores = Number(croreMatch[1]) * 10000000;
      filter.price = { $lte: priceInCrores };
    }

    // Detect city
    const cities = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata', 'jaipur', 'ahmedabad', 'lucknow', 'noida', 'gurgaon', 'chandigarh', 'indore', 'bhopal'];
    for (const city of cities) {
      if (lowerQuery.includes(city)) {
        filter['location.city'] = new RegExp(city, 'i');
        break;
      }
    }

    const properties = await Property.find(filter)
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(20);

    // Generate AI response summary
    const typeLabel = filter.type ? filter.type + 's' : 'properties';
    const cityLabel = filter['location.city'] ? ` in ${filter['location.city'].source}` : '';
    const bedroomLabel = filter.bedrooms ? ` with ${filter.bedrooms.$gte}+ bedrooms` : '';
    const priceLabel = filter.price ? ` under ₹${(filter.price.$lte / 100000).toFixed(0)} Lakh` : '';

    const summary = properties.length > 0
      ? `Found ${properties.length} ${typeLabel}${cityLabel}${bedroomLabel}${priceLabel}`
      : `No ${typeLabel} found matching your criteria. Try broadening your search.`;

    res.json({ summary, properties, filters: filter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate AI property description
// @route   POST /api/ai/description
const aiDescription = async (req, res) => {
  try {
    const { title, type, bedrooms, bathrooms, area, location, amenities, price } = req.body;

    const typeLabels = { house: 'house', flat: 'apartment', shop: 'commercial space', plot: 'plot' };
    const typeLabel = typeLabels[type] || 'property';

    const amenityText = amenities && amenities.length > 0
      ? `This property comes with premium amenities including ${amenities.join(', ')}.`
      : 'This well-maintained property offers a comfortable living experience.';

    const bedroomText = bedrooms > 0
      ? `Featuring ${bedrooms} spacious bedroom${bedrooms > 1 ? 's' : ''} and ${bathrooms} modern bathroom${bathrooms > 1 ? 's' : ''}, `
      : '';

    const descriptions = [
      `Discover this stunning ${typeLabel} located in the heart of ${location?.city || 'the city'}. ${bedroomText}this ${area} sq ft property is perfect for those seeking quality living. ${amenityText} Priced at ₹${(price / 100000).toFixed(2)} Lakh, this is an exceptional opportunity you don't want to miss. The property is situated in ${location?.address || 'a prime location'}, ${location?.city || ''}, ${location?.state || ''}, offering excellent connectivity and neighborhood amenities.`,

      `Welcome to ${title || 'your dream ' + typeLabel}! This magnificent ${area} sq ft ${typeLabel} in ${location?.city || 'a prime location'} offers the perfect blend of luxury and comfort. ${bedroomText}every corner of this property has been designed with elegance in mind. ${amenityText} Located at ${location?.address || 'a prestigious address'} in ${location?.city || ''}, ${location?.state || ''}, this property provides easy access to schools, hospitals, shopping centers, and public transport. Listed at ₹${(price / 100000).toFixed(2)} Lakh, this property represents outstanding value for discerning buyers.`,

      `Presenting an exquisite ${typeLabel} that redefines modern living in ${location?.city || 'the city'}! Spanning ${area} sq ft of thoughtfully designed space, ${bedroomText}this property offers a lifestyle you've always dreamed of. ${amenityText} Nestled in ${location?.address || 'a sought-after locality'}, ${location?.city || ''}, ${location?.state || ''}, you'll enjoy the perfect balance of urban convenience and peaceful surroundings. An incredible investment opportunity at ₹${(price / 100000).toFixed(2)} Lakh.`,
    ];

    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];

    res.json({ description: randomDesc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    AI price estimation
// @route   POST /api/ai/price-estimate
const aiPriceEstimate = async (req, res) => {
  try {
    const { type, area, bedrooms, bathrooms, city, amenities } = req.body;

    // Base price per sq ft by property type (in INR)
    const basePrices = {
      house: 5500,
      flat: 6500,
      shop: 8000,
      plot: 3500,
    };

    // City multipliers
    const cityMultipliers = {
      mumbai: 3.2, delhi: 2.5, bangalore: 2.3, hyderabad: 1.8,
      pune: 1.9, chennai: 2.0, kolkata: 1.5, jaipur: 1.3,
      ahmedabad: 1.4, gurgaon: 2.6, noida: 2.0, chandigarh: 1.7,
      lucknow: 1.2, indore: 1.1, bhopal: 1.0,
    };

    const basePrice = basePrices[type] || 5000;
    const cityMult = cityMultipliers[city?.toLowerCase()] || 1.0;

    let price = basePrice * area * cityMult;

    // Bedroom premium
    if (bedrooms > 2) price *= 1 + ((bedrooms - 2) * 0.08);
    // Bathroom premium
    if (bathrooms > 1) price *= 1 + ((bathrooms - 1) * 0.04);
    // Amenities premium
    if (amenities && amenities.length > 0) price *= 1 + (amenities.length * 0.03);

    // Add some variance
    const lowEstimate = Math.round(price * 0.9);
    const highEstimate = Math.round(price * 1.1);
    const estimate = Math.round(price);

    res.json({
      estimate,
      lowEstimate,
      highEstimate,
      pricePerSqFt: Math.round(price / area),
      formattedEstimate: `₹${(estimate / 100000).toFixed(2)} Lakh`,
      formattedLow: `₹${(lowEstimate / 100000).toFixed(2)} Lakh`,
      formattedHigh: `₹${(highEstimate / 100000).toFixed(2)} Lakh`,
      factors: {
        basePrice: `₹${basePrice}/sq ft`,
        cityMultiplier: `${cityMult}x (${city || 'default'})`,
        area: `${area} sq ft`,
        type,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { aiSearch, aiDescription, aiPriceEstimate };
