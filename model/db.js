const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Users');

const Schema = mongoose.Schema;

const userLoginSchema = new Schema({
    login: String,
    pass: String
});

const UserLoginModel = mongoose.model('Users', userLoginSchema);

module.exports = {
    UserLoginModel
};