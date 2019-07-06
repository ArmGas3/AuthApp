const mongoose = require('mongoose');


class Database {

    constructor(url) {
        mongoose.connect(url);
        this.Schema = mongoose.Schema;
        this.UserLoginSchema = new this.Schema({
            login: String,
            pass: String
        });

        this.UserLoginModel = mongoose.model('Users', this.UserLoginSchema);
    }

    getModel() {
        return this.UserLoginModel;
    }

}

module.exports = Database;