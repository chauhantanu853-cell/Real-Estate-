const MockModel = require('../utils/mockMongoose');

// Set up default users
const defaultUsers = [
  {
    _id: "admin1",
    name: "Admin User",
    email: "admin@dreamhome.com",
    password: "password123",
    role: "admin",
    phone: "9876543210",
    avatar: ""
  },
  {
    _id: "seller1",
    name: "John Seller",
    email: "seller@dreamhome.com",
    password: "password123",
    role: "seller",
    phone: "9876543211",
    avatar: ""
  },
  {
    _id: "buyer1",
    name: "Jane Buyer",
    email: "buyer@dreamhome.com",
    password: "password123",
    role: "buyer",
    phone: "9876543212",
    avatar: ""
  }
];

// Create the MockModel instance
const UserModel = new MockModel('User', defaultUsers);

module.exports = UserModel;
