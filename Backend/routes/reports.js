const router = require('express').Router();
let Report = require('../models/report.model');
const auth = require('../middleware/auth')
router.use(auth)
router.route('/').get((req,res) => {
    Report.find()
        .then(reports => res.json(reports))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const imageID = req.body.imageID;
    const report = req.body.report;
    const username = req.body.username;

    const newReport = new Report({
        username,
        report,
        imageID
    });

    newReport.save()
        .then(() => res.json('Report added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req,res) => {
    Report.findById(req.params.id)
        .then(report => res.json(report))
        .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/:id').delete((req,res) => {
    Report.findByIdAndDelete(req.params.id)
        .then(report => res.json('Report deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;