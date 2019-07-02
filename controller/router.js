const express = require('express');
const router = express.Router();

const UserLoginModel = require('.././model/db').UserLoginModel;

router.get('/', (req, res) => {
    res.render('home');
});

router.post('/login', (req, res) => {

    UserLoginModel.find({login: req.body.login, pass: req.body.pass}).then(data => {
        console.log(data, 'You are logged in boss...');
        res.render('home', {msg: 'logged'});
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

module.exports = router;