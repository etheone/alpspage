var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
    imageName: String,
    tags: [],
    description: String
});

module.exports = mongoose.model('Image', imageSchema);
