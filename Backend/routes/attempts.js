const router = require('express').Router();
const auth = require('../middleware/auth')
let Attempt = require('../models/attempt.model');
let Exam = require('../models/exam.model');

//router.use(auth)

router.route('/').get((req,res) => {
    Attempt.find()
        .then(attempts => res.json(attempts))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/scores').get((req,res) => {
    date = new Date()
    month = date.getMonth()
    year = date.getFullYear()
    Attempt.find({date : {$gte: new Date(year,month,1)}}).sort({"score" : "desc"})
        .then(attempts => {
            res.json(getMonthlyScores(attempts));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/scoresPast').get((req,res) => {
    date = new Date()
    month = date.getMonth() - 1
    year = date.getFullYear()
    Attempt.find({date : {$gte: new Date(year,month,1), $lte: new Date(year, month, 31)}}).sort({"score" : "desc"})
        .then(attempts => res.json(getMonthlyScores(attempts)))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/scoresWeek').get((req,res) => {
    date = Date.now()
    today = new Date(date)
    //week = 1000 * 60 * 60 * 24 * 7
    //lastWeek = new Date(today - week)
    //console.log(today, lastWeek, date, week)
    //Attempt.find({date : {$gte: lastWeek, $lte: today}}).sort({"score" : "desc"})
    Attempt.find({examDueDate : {$gte: today}}).sort({"score" : "desc"})
        .then(attempts => res.json(attempts))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const examName = req.body.examName;
    const score = Number(req.body.score);
    const date = Date.parse(req.body.date);
    const examDueDate = Date.parse(req.body.examDueDate);
    const examID = req.body.examID;
    const newAttempt = new Attempt({
        username,
        examName,
        score,
        date,
        examDueDate,
        examID
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

router.route('/getAttempt').post((req,res) => {
    const username = req.body.username;
    const examID = req.body.examID;
    Attempt.findOneAndUpdate({username: username, examID: examID}, {$inc: {attempt: -1}}, {new: true})
        .then(attempt =>{
            if(attempt){
                return res.json(attempt);
            }
            else{
                Exam.findById(examID)
                    .then(exam => {
                        const examName = exam.examName;
                        const score = 0;
                        const date = Date.now();
                        const examDueDate = Date.parse(exam.dueDate);
                        const attempt = exam.attempts;
                        const newAttempt = new Attempt({
                            username,
                            examName,
                            score,
                            date,
                            examDueDate,
                            examID,
                            attempt
                        });
                        newAttempt.save()
                            .then(newAt => res.json(newAt))
                            .catch(err => res.status(400).json('Error: ' + err));
                    })
                    .catch(err => res.status(400).json('Error: ' + err));

            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/updateAttempt').post((req,res) => {
    const username = req.body.username;
    const examID = req.body.examID;
    const score = Number(req.body.score);
    const date = Date.parse(req.body.date);
    Attempt.findOne({username: username, examID: examID})
    .then(attempt => {
        if(score > attempt.score) attempt.score = score;
        attempt.date = date;
        attempt.save()
            .then(() => res.json('Attempt updated!'))
            .catch(err => res.status(400).json('Error: ' + err));

    })
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;

function getMonthlyScores(attempts){
    playerScores = [];
    let username = "";
    let userScore = 0;
    for(i=0; i<attempts.length; i++){
        userScore = 0;
        if(attempts[i].username != ""){
            username = attempts[i].username;
            userScore += attempts[i].score;
            attempts[i].username = "";
            for(j=i; j<attempts.length; j++){
                if(username == attempts[j].username){
                    attempts[j].username = "";
                    userScore += attempts[j].score;
                }
            }
            playerScores.push({
                "username": username,
                "score": userScore
            })
        }
    }
    playerScores.sort((a, b) => {
        return b.score - a.score;
    });
    return playerScores;

}