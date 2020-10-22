const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 6
    },
    // Pending jwt token generation
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

const User = mongoose.model('User', userSchema);

module.exports = User;