const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 6
    },
    password: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minlength: 8
    }
}, {
    timestamps: true,
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;