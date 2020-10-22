const router = require('express').Router();
let Attempt = require('../models/attempt.model');

router.route('/').get((req,res) => {
    Attempt.find()
        .then(attempts => res.json(attempts))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const exam = req.body.exam;
    const score = Number(req.body.score);
    const date = Date.parse(req.body.date);
    
    const newAttempt = new Attempt({
        username,
        exam,
        score,
        date,
    });

    newAttempt.save()
        .then(() => res.json('Attempt recorded!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req,res) => {
    Attempt.findById(req.params.id)
        .then(attempt => res.json(attempt))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req,res) => {
    Attempt.findByIdAndDelete(req.params.id)
        .then(attempt => res.json('Attempt deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Attempt.findById(req.params.id)
        .then(attempt => {
            attempt.username = req.body.username;
            attempt.exam = req.body.exam;
            attempt.score = Number(req.body.score);
            attempt.date = Date.parse(req.body.date);

            attempt.save()
                .then(() => res.json('Exam updated!'))
                .catch(err => res.status(400).json('Error: ' + err));

        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;