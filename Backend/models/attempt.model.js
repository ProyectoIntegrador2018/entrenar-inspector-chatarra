const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const attemptSchema = new Schema({
    username: { type: String, required: true },
    examName: { type: String, required: true },
    examID: { type: Schema.Types.ObjectId, ref: 'Exam' },
    score: { type: Number, required: true },
    attempt: { type: Number },
    date: { type: Date, required: true },
    examDueDate: {type: Date, required: true}
}, {
    timestamps: true,
});

const Attempt = mongoose.model('Attempt', attemptSchema);

module.exports = Attempt;