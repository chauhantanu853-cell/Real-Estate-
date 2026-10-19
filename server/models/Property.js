const MockModel = require('../utils/mockMongoose');

const defaultProperties = [
  {
    _id: "p1",
    title: "Luxury Villa in Juhu",
    description: "Beautiful 4BHK luxury villa with private pool, sea view, and premium fittings in a gated community in Juhu.",
    type: "house",
    price: 25000000,
    area: 3500,
    bedrooms: 4,
    bathrooms: 3,
    location: {
      address: "Juhu Tara Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400049"
    },
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
    amenities: ["Swimming Pool", "Garden", "Gym", "Security"],
    seller: "seller1",
    status: "approved",
    featured: true
  },
  {
    _id: "p2",
    title: "Modern 3BHK Apartment",
    description: "Fully furnished modern 3BHK flat in the heart of Koramangala with state-of-the-art electronics, modular kitchen and balcony.",
    type: "flat",
    price: 8500000,
    area: 1800,
    bedrooms: 3,
    bathrooms: 2,
    location: {
      address: "100 Feet Road, Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034"
    },
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
    amenities: ["Elevator", "Power Backup", "Gym", "Clubhouse"],
    seller: "seller1",
    status: "approved",
    featured: true
  },
  {
    _id: "p3",
    title: "Premium Commercial Shop",
    description: "High footfall commercial space in Connaught Place, ideal for retail, restaurant, showroom or premium office space.",
    type: "shop",
    price: 12000000,
    area: 1200,
    bedrooms: 0,
    bathrooms: 1,
    location: {
      address: "Radial Road 2, Connaught Place",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001"
    },
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"],
    amenities: ["Air Conditioning", "Fire Alarm", "24/7 Access", "Parking"],
    seller: "seller1",
    status: "approved",
    featured: false
  },
  {
    _id: "p4",
    title: "Residential Plot Noida",
    description: "Freehold residential plot of 200 sq yards in Sector 62, Noida. East facing, wide roads, ready for construction.",
    type: "plot",
    price: 4500000,
    area: 2400,
    bedrooms: 0,
    bathrooms: 0,
    location: {
      address: "Sector 62",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301"
    },
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
    amenities: ["Water Connection", "Gated Community", "Street Lights"],
    seller: "seller1",
    status: "approved",
    featured: true
  }
];

const PropertyModel = new MockModel('Property', defaultProperties);

module.exports = PropertyModel;
