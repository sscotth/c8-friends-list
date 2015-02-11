/* jshint browser: true, jquery: true, node: true */
/* global Firebase: false */

'use strict';

var fb    = require('./db'),
    auth  = {};

auth.isLoggedIn = function () {
  return !!auth.getAuth();
};

auth.getAuth = function () {
  return fb.getAuth();
};

auth.userId = function () {
  auth.getAuth().uid;
}




module.exports = auth;
