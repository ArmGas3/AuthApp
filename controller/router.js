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

const Model = new UserLoginModel('mongodb://localhost:27017/Users');
const model = Model.getModel();
const postModel = Model.getPostModel();

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) console.log(err);
        res.redirect('/');
    });
});

router.get('/profile', auth, (req, res) => {
    postModel.find({})
        .then(data => {
            return res.render('login', {user: req.session.user.login, posts: data});
        });

});

router.post('/profile', (req, res) => {
    let {login, pass} = req.body;

    if (login && pass) {

        model.findOne({login}).then(data => {
            if (!data) {
                return res.redirect('/error');
            }

            bcrypt.compare(pass, data.pass)
                .then((user) => {
                    if (user) {
                        req.session.user = {login: data.login, pass};
                        req.session.loggedIn = true;
                        return res.redirect('/profile');
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
                .then((data) => {
                    transporter.sendMail({
                        to: email,
                        from: 'app@node.com',
                        subject: 'Sign up succeeded',
                        html: '<h1>Thank you for registration</h1>'
                    })

                    .catch(err => {
                        console.log(err);
                    });
                    res.redirect('/');
            });
        });
});

router.get('/getPosts', (req, res) => {
    postModel.find({}).then(data => res.send(data));
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
    crypto.randomBytes(64, (err, buffer) => {
        res.send(buffer.toString('hex'));
    });
});

router.get('/post', auth, (req, res) => {
    res.render('post');
});

router.post('/posts', auth, (req, res) => {
    let {title, body} = req.body;

    let post = new postModel({title, body});

    post.save()
        .then((data) => {
            return res.redirect('/profile')
        })

        .catch(err => console.log(err.message));
});

module.exports = router;