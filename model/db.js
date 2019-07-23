const mongoose = require('mongoose');

class Database {

    constructor(url) {
        mongoose.connect(url, {useNewUrlParser: true});
        this.Schema = mongoose.Schema;
        this.UserLoginSchema = new this.Schema({
            login: {
                type: String,
                required: true,
                unique: true
            },
            pass: {
                type: String,
                required: true,
                unique: true
            },
            email: {
                type: String,
                required: true
            }
        });

        this.PostSchema = new this.Schema({
            title: {
                type: String,
                required: true
            },
            body: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now()
            }
        });

        this.PostModel = mongoose.model('posts', this.PostSchema);

        this.UserLoginModel = mongoose.model('Users', this.UserLoginSchema);
    }

    getModel() {
        return this.UserLoginModel;
    }

    getPostModel() {
        return this.PostModel;
    }
}

module.exports = Database;