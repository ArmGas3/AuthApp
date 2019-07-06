const express = require('express');
const router = express.Router();

const UserLoginModel = require('../db');

let Model = new UserLoginModel('mongodb://localhost:27017/Users');
let model = Model.getModel();

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

router.post('/login', (req, res) => {

    let {login, pass} = req.body;

    model.find({login, pass}).then(data => {

        if (data[0].login === login && data[0].pass === pass) {
            req.session.loggedIn = true;
            req.session.user = data[0];
            res.render('login', {user: data[0].login});
        } else {
            res.redirect('/error');
        }
    });
});

router.post('/register', (req, res) => {

    let user = new model({login: req.body.login, pass: req.body.pass});

    user.save().then(() => {
        res.render('home', {msg: 'success'});
    });
});

router.get('/index', (req, res) => {
    model.find({}).then(data => res.send(data));
});

router.get('/error', (req, res) => {
    res.render('error');
});

module.exports = router;