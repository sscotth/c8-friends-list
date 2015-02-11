/* jshint browser: true, jquery: true */
/* global Firebase: false */

'use strict';

var $addFriendForm = $('.app form'),
    $friendsTable  = $('tbody'),
    auth           = require('./auth');

if (auth.isLoggedIn) {
  $('.login').remove();
  $('.app').toggleClass('hidden');
}

$('.login input[type="button"]').click(function () {
  var $loginForm = $(event.target.closest('form')),
      email      = $loginForm.find('[type="email"]').val(),
      pass       = $loginForm.find('[type="password"]').val(),
      data       = {email: email, password: pass};

  registerAndLogin(data, function (err, auth) {
    if (err) {
      $('.error').text(err);
    } else {
      location.reload(true);
    }
  });
});

$('.login form').submit(function (evt) {
  var $loginForm = $(event.target),
      email      = $loginForm.find('[type="email"]').val(),
      pass       = $loginForm.find('[type="password"]').val(),
      data       = {email: email, password: pass};

  evt.preventDefault();

  fb.authWithPassword(data, function (err, auth) {
    if (err) {
      $('.error').text(err);
    } else {
      location.reload(true);
    }
  });
});

$('.logout').click(function () {
  fb.unauth();
  location.reload(true);
});

$friendsTable.on('click', 'td', function (evt) {
  // this = event.target;
  var $tr  = $(evt.target).closest('tr'),
      uuid = $tr.data('uuid'),
      friendName = $tr.find('td').text();

  if (confirmFriendRemoval(friendName)) {
    $tr.remove();
    deleteFriendFromDb(uuid);
  }
});

$addFriendForm.submit(function (evt) {
  var $friendName = $('input[name="friendName"]'),
      req         = {name: $friendName.val()};

  evt.preventDefault();

  addFriendToDb(req, function (res) {
    var $tr = $('<tr><td>' + req.name + '</td></tr>');

    $tr.attr('data-uuid', res.name);
    $friendsTable.append($tr);
  });

  $friendName.val('');
});

function registerAndLogin(obj, cb) {
  fb.createUser(obj, function(err) {
        if (!err) {
            fb.authWithPassword(obj, function (err, auth) {
        if (!err) {
          cb(null, auth);
        } else {
          cb(err);
        }
      });
    } else {
      cb(err);
    }
  });
}

function addFriendToDb(data, cb) {
  var url           = usersFbUrl + '/friends.json',
      jsonifiedData = JSON.stringify(data);

  $.post(url, jsonifiedData, function (res) { return cb(res); });
}

function deleteFriendFromDb(uuid) {
  var url = usersFbUrl + '/friends/' + uuid + '.json';

  $.ajax(url, {type: 'DELETE'});
}

function addRowToTable(uuid, data) {
  var $tr = $('<tr><td>' + data.name + '</td></tr>');

  $tr.attr('data-uuid', uuid);
  $friendsTable.append($tr);
}

function confirmFriendRemoval(friendName) {
  var confirmationText = 'Remove ' + friendName + ' from friend list?',
      isConfirmed      = window.confirm(confirmationText);

  return isConfirmed;
}
