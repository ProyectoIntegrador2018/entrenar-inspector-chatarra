const router = require('express').Router();
const bcrypt = require( 'bcryptjs' );
const auth = require('../middleware/auth')
const jsonwebtoken = require( 'jsonwebtoken' );
let User = require('../models/user.model');
const SECRET = process.env.SECRET || "secretsecret"

router.route('/').get(auth,(req,res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(auth,(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, 10)
        .then( hashedPassword => {
            let password = hashedPassword
            const newUser = new User({username, password});
        
            newUser.save()
            .then(() => res.json('User added!'))
            .catch(err => res.status(400).json('Error: ' + err));
            

        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

router.route('/login').post((req,res) => {
    let { username, password } = req.body;

    if(!username || !password ){
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status( 406 ).end();
    }
    User.findOne( { username } )
        .then( user => {
            console.log(user);
            bcrypt.compare( password, user.password )
                .then( result => {
                    if( result ){
                        jsonwebtoken.sign( user.username, SECRET, ( err, token ) => {
                            if( err ){
                                res.statusMessage = err.message;
                                return res.status( 400 ).end();
                            }
                            return res.status( 200 ).json( { token } );
                        });
                    }
                    else{
                        res.statusMessage = "Wrong credentials.";
                        return res.status( 409 ).end();
                    }
                
                 })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })
    })
});

router.route('/:id').get((req,res) => {
    User.findById(req.params.id)
        .then(username => res.json(username))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete(auth,(req,res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json('User deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post(auth,(req, res) => {
    User.findById(req.params.id)
        .then(user => {
            user.username = req.body.username;
            user.password = req.body.password;

            user.save()
                .then(() => res.json('User updated!'))
                .catch(err => res.status(400).json('Error: ' + err));

        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;