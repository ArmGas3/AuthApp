module.exports = (req, res, next) => {

    let bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ");

        const token = bearerToken[1];

        req.token = token;
        next();
    } else {
        res.sendStatus(403);
    }

};