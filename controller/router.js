const express = require('express');
const router = express.Router();
const verifyToken = require('./verifytoken');
const jwt = require('jsonwebtoken');

const UserLoginModel = require('.././model/db').UserLoginModel;

router.get('/', (req, res) => {

    if (req.session.loggedIn === true) {
        console.log('The user is logged in');
    }
    res.render('home');
});

router.get('/login', (req, res) => {

    if (req.session.loggedIn === true) {
        res.render('login', {user: req.session.user.login});
    } else {
        res.redirect('/');
    }
});

router.post('/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secret_key', (err, payload) => {

        console.log('Req token:', req.token);
        if (err) throw err;
        else {
            res.json({
                msg: 'Post created',
                payload
            });
        }

    });
});

router.post('/login', (req, res) => {

    let {login, pass} = req.body;

    UserLoginModel.find({login, pass}).then(data => {

        if (data[0].login === login && data[0].pass === pass) {
            req.session.loggedIn = true;
            req.session.user = data[0];
            let user = data[0];
            jwt.sign({user}, 'secret_key', ((err, token) => {
                if (err) throw err;

                console.log(token);

                res.render('login', {user: data[0].login});

            }));

        } else {
            res.redirect('/error');
        }
    });
});

router.post('/register', (req, res) => {

    let user = new UserLoginModel({login: req.body.login, pass: req.body.pass});

    user.save().then(() => {
        res.render('home', {msg: 'success'});
    });
});

router.get('/index', (req, res) => {
    UserLoginModel.find({}).then(data => res.send(data));
});

router.get('/error', (req, res) => {
    res.render('error');
});

module.exports = router;