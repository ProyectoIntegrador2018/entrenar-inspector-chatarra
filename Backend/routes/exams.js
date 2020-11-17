const router = require('express').Router();
const auth = require('../middleware/auth');
let Exam = require('../models/exam.model');

// router.use(auth)

router.route('/').get((req,res) => {
    Exam.find()
        .then(exams => res.json(exams))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/monthly').get((req,res) => {
    date = new Date()
    month = date.getMonth()
    year = date.getFullYear()
    today = date.getDate()
    console.log(month, year, today)
    Exam.find({date : {$gte: new Date(year,month,1), $lte: new Date(year,month,today)}}).sort({"score" : "desc"})
        .then(exams => res.json(exams))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const examName = req.body.examName;
    const images = req.body.images;
    const size = req.body.size;
    const pool = req.body.pool;
    const attempts = req.body.attempts;
    const description = req.body.description;
    const date = req.body.date;
    const dueDate = req.body.dueDate;
    const newExam = new Exam({
        examName,
        images,
        size,
        pool,
        attempts,
        description,
        date,
        dueDate
    });

    newExam.save()
        .then(() => res.json('Exam added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req,res) => {
    Exam.findById(req.params.id)
        .then(exam => res.json(exam))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req,res) => {
    Exam.findByIdAndDelete(req.params.id)
        .then(exam => res.json('Exercise deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Exam.findById(req.params.id)
        .then(exam => {
            exam.examName = req.body.examName;
            exam.images = req.body.images;
            exam.size = req.body.size;
            exam.pool = req.body.pool;
            exam.attempts = req.body.pool;
            exam.description = req.body.description;

            exam.save()
                .then(() => res.json('Exam updated!'))
                .catch(err => res.status(400).json('Error: ' + err));

        })
        .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;