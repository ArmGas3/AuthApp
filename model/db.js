const mongoose = require('mongoose');


class Database {

    constructor(url) {
        mongoose.connect(url);
        this.Schema = mongoose.Schema;
        this.UserLoginSchema = new this.Schema({
            login: {
                type: String,
                required: true
            },
            pass: {
                type: String,
                required: true
            }
        });

        this.UserLoginModel = mongoose.model('Users', this.UserLoginSchema);
    }

    getModel() {
        return this.UserLoginModel;
    }
}

module.exports = Database;