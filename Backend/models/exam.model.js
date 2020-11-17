const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const examSchema = new Schema({
    examName: { type: String, required: true },
    images:[{ type: Schema.Types.ObjectId, ref: 'Image' }],
    size: { type: Number },
    pool: { type: Number },
    attempts : { type: Number },
    description: { type: String },
    date: { type: Date, required: true },
    dueDate: { type: Date, required: true }
}, {
    timestamps: true,
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;