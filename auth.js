var jwt = require('jwt-simple');
var users = require('./users');
var _ = require('lodash');

var secret = process.env.SECRET || '!@#%$^&**(^#$@%^&)';
var authHeaderName = 'x-access-token';

exports.provideUsers = function(usersProvider) {
    users = users;
};

exports.auth = function(req, res) {
    var username = req.params.username || req.query.username || null;
    var password = req.params.password || req.query.password || null;

    var user = users.find(username, password);

    if (!user) {
        res.send(401, {err: 'Invalid user or password'});
        return;
    }

    var token = jwt.encode(user, secret);

    res.set(authHeaderName, token);
    res.status(200).send(user);

    return;
};

exports.hasPermission = function(permission) {
    return function(req, res, next) {
        var token =
            (req.body && req.body.access_token)
            || (req.query && req.access_token)
            || (req.headers[authHeaderName]);

        if (!token) {
            res.status(401).send({ err: 'Missing token' });
            return;
        }

        var decoded;

        try {
            decoded = jwt.decode(token, secret);
        } catch(err) {
            res.status(401).send({ err: 'Invalid token' });
            return;
        }

        if (decoded.permissions && false === _.includes(decoded.permissions, permission)) {
            res.status(401).send({ err: 'Access denied' });
            return;
        }

        next();
    };
};
