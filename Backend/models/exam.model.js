const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const examSchema = new Schema({
    examName: { type: String, required: true },
    images : [String],
    description: { type: String},
}, {
    timestamps: true,
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;