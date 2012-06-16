Template.login_screen.player_name = function () {
  return Session.get("username") || "";
};

Template.login_screen.status_message = function () {
  return Session.get("fspace_status") ||
    "Enter a player name, or click on one";
};

Template.login_screen.player_name_disabled = function () {
  var response = "disabled=\"true\"";
  if (Session.get("username") === undefined) {
    response = "";
  }
  return response;
};

Template.login_screen.login_button_text = function () {
  var response = "Logout";
  if (Session.get("username") === undefined) {
    response = "Login as:";
  }
  return response;
};


Template.login_screen.do_login = function () {
  username = $("input.username").attr('value');
  fspace.msg("Logging in as "+ username);
  if (fspace.login(username)) {
    Session.set("username", username);
    $("input.username").attr('disabled', true);
  } else {
    $("input.username").attr('value', '');
    $("input.username").focus();
  }
};


// Event list
Template.login_screen.events = {

  // When the loginout button is clicked...
  'click input.loginout': function () {
    if ($("input.loginout").attr('value') === 'Login as:') {
      Template.login_screen.do_login();
    }
    else {
      // Logout
      $("input.username").attr('disabled', false);
      fspace.msg("Logging out "+ Session.get("username"));
      Session.set("username", null);
      fspace.logout();
    };
  },

  // When the loginout button is clicked...
  'keypress input.username': function (e) {
    if (e.which === Crafty.keys['ENTER']) {
      Template.login_screen.do_login();
    }
  }

};
