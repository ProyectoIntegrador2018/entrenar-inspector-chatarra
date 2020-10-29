const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const examSchema = new Schema({
    examName: { type: String, required: true },
    images :[{type: Schema.Types.ObjectId, ref: 'Imagen'}],
    description: { type: String},
}, {
    timestamps: true,
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;