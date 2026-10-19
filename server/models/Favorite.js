const MockModel = require('../utils/mockMongoose');

const FavoriteModel = new MockModel('Favorite', []);

module.exports = FavoriteModel;
