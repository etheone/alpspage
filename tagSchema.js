var mongoose = require('mongoose');

var tagSchema = mongoose.Schema({
    tagName: String
});

module.exports = mongoose.model('Tag', tagSchema);
