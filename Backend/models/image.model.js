const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    imageURL : { type: String, required: true },
    classification : { type: String, required: true },
}, {
    timestamps: true,
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;