const router = require('express').Router();

const auth = require('../middleware/auth')
let Exam = require('../models/exam.model');
router.use(auth)
router.route('/').get((req,res) => {
    Exam.find()
        .then(exams => res.json(exams))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const examName = req.body.examName;
    const images = req.body.images;
    const description = req.body.description
    
    const newExam = new Exam({
        examName,
        images,
        description,
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
            exam.description = req.body.description;

            exam.save()
                .then(() => res.json('Exam updated!'))
                .catch(err => res.status(400).json('Error: ' + err));

        })
        .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;