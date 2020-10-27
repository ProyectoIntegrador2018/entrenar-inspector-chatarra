const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    username : { 
        type: String,
        required: true },
    report : { 
        type: String,
        required: true },
    imageID : { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Image',
        required: true }
    
}, {
    timestamps: true,
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;