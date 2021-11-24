const mongoose = require('mongoose');

const gamingSchema = new mongoose.Schema({
});

const Gaming = mongoose.model('Gaming', gamingSchema);

module.exports = Gaming;