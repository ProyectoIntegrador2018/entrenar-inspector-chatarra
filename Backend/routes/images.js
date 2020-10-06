const router = require('express').Router();
let Image = require('../models/image.model');

router.route('/').get((req,res) => {
    Image.find()
        .then(images => res.json(images))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const imageURL = req.body.imageURL;
    const classification = req.body.classification;

    const newImage = new Image({
        imageURL,
        classification,
    });

    newImage.save()
        .then(() => res.json('Image added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req,res) => {
    Image.findById(req.params.id)
        .then(image => res.json(image))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req,res) => {
    Image.findByIdAndDelete(req.params.id)
        .then(image => res.json('Image deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Image.findById(req.params.id)
        .then(image => {
            image.classification = req.body.classification;

            image.save()
                .then(() => res.json('Image updated!'))
                .catch(err => res.status(400).json('Error: ' + err));

        })
        .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;