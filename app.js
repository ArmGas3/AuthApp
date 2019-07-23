const express = require('express');
const bps = require('body-parser');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const router = require('./controller/router');
const store = new MongoDbStore({
    uri: 'mongodb://localhost:27017/Users',
    collection: 'sessions'
});
const app = express();

app.set('view engine', 'ejs');
app.use('/', bps.json());
app.use('/', bps.urlencoded({extended: false}));
app.use('/', express.static(__dirname + '/views/public'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
        maxAge: 600000
    }
}));
app.use('/', router);

app.listen(3000, () => {
    console.log('Auth app is started my boss...');
});

