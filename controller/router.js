const express = require('express');
const router = express.Router();
const auth = require('./auth');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemail = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');

const transporter = nodemail.createTransport(sendgrid({
    auth: {
        api_key: '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'
    }
}));

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

    let {login, pass, email} = req.body;

    bcrypt.hash(pass, 12)
        .then(hash => {
            let user = new model({login, pass: hash, email});

            user.save()
                .then(() => {
                    transporter.sendMail({
                        to: email,
                        from: 'app@node.com',
                        subject: 'Sign up succeeded',
                        html: '<h1>Thank you for registration</h1>'
                    })

                    .catch(err => {
                        console.log(err);
                    });
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

router.get('/cr', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        res.send(buffer.toString('hex'));
    });
});

module.exports = router;