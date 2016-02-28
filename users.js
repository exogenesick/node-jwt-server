var _ = require('lodash');

var users = [
    { username: 'guest', password: 'guest', permissions: [] },
    { username: 'exogenesick', password: 'secret_123', permissions: ['articles', 'users'] }
];

exports.find = function(username, password) {
    return _.find(users, { username: username, password: password });
};
