const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const attemptSchema = new Schema({
    username: { type: String, required: true },
    exam: { type: String, required: true },
    score: {type: Number},
    date: { type: Date, required: true },
}, {
    timestamps: true,
});

const Attempt = mongoose.model('Attempt', attemptSchema);

module.exports = Attempt;