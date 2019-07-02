const express = require('express');
const bps = require('body-parser');
const session = require('express-session');
const router = require('./controller/router');

const app = express();

app.set('view engine', 'ejs');

app.use('/', bps.json());
app.use('/', bps.urlencoded({extended: false}));
app.use('/', express.static('/views'));
app.use(session({secret: 'secret', resave: false, saveUninitialized: false}));
app.use('/', router);

app.listen(3000, () => {
    console.log('Auth app is started my boss...');
});

