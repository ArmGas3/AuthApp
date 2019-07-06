const express = require('express');
const router = express.Router();
const auth = require('./auth');
const bcrypt = require('bcrypt');

const UserLoginModel = require('.././model/db');

let Model = new UserLoginModel('mongodb://localhost:27017/Users');
let model = Model.getModel();

router.get('/', (req, res) => {
    res.render('home');
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
});

router.get('/login', auth, (req, res) => {
    res.render('login', {user: req.session.user.login});
});

router.post('/login', (req, res) => {
    let {login, pass} = req.body;

    if (login && pass) {

        model.findOne({login}).then(data => {
            if (!data) {
                res.redirect('/');
            }

            bcrypt.compare(pass, data.pass)
                .then((user) => {
                    if (user) {
                        req.session.user = {login: data.login, pass};
                        req.session.loggedIn = true;
                        return res.redirect('/login');
                    } else {
                        res.redirect('/');
                    }
                })
                .catch(err => {
                    res.redirect('/');
                });
        })

            .catch((err) => {
                res.redirect('/error');
            });
    } else {
        res.render('home');
    }
});

router.post('/register', (req, res) => {

    let {login, pass} = req.body;

    bcrypt.hash(pass, 12)
        .then(hash => {
            let user = new model({login, pass: hash});

            user.save().then(() => {
                res.render('home', {msg: 'success'});
            });
        });
});

router.get('/index', (req, res) => {
    model.find({}).then(data => res.send(data));
});

router.get('/error', (req, res) => {
    res.render('error');
});

router.get('/rm', (req, res) => {
    model.remove({}).then(data => res.send(data));
});

module.exports = router;