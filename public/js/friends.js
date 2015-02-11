/* jshint browser: true, jquery: true, node: true */
/* global _: false */

'use strict';

var db = require('./db'),
    friendsUrl = db.urlPrefix + 'friends.json';


$.get(friendsUrl, function (res) {
  _.forEach(res, function (uuid) {
    addRowToTable(uuid, res[uuid]);
  });
});
