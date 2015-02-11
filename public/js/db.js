/* jshint node: true */
/* global Firebase: false */

'use strict';

var config = require('./config'),
    auth   = require('./auth'),
    db     = {};

db.urlPrefix = config.BASE_URL + '/users/' + auth.userId + '/data';

module.exports = db;
