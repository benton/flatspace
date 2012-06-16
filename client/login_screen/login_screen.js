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
  username  = $("input.username").attr('value');
  type      = Template.ship_options.get_ship_type();
  color     = Template.ship_options.get_ship_color();
  fsClient.msg("Logging in as "+ username);
  if (fsClient.login(username, type, color)) {
    Session.set("username", username);
    Session.set("selected_player", null);
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
      fsClient.msg("Logging out "+ Session.get("username"));
      Session.set("username", null);
      fsClient.logout();
    };
  },

  // When the loginout button is clicked...
  'keypress input.username': function (e) {
    if (e.which === Crafty.keys['ENTER']) {
      Template.login_screen.do_login();
    }
  }

};

Template.login_screen.loggedin = function () {
  if (Session.get("username")) { return true; }
  return false;
};


// SHIP OPTIONS

Template.ship_options.set_ship_color = function (color) {
  $('.ship_color input:radio').each(function() {
    if ($(this).attr('value') === color) { $(this).attr('checked', true); }
  })
};

Template.ship_options.get_ship_color = function () {
  color = undefined;
  $('.ship_color input:radio').each(function() {
    if ($(this).attr('checked') == 'checked') { color = $(this).attr('value'); }
  })
  return color;
};

Template.ship_options.set_ship_type = function (type) {
  $('.ship_type input:radio').each(function() {
    if ($(this).attr('value') === type) { $(this).attr('checked', true); }
  })
};

Template.ship_options.get_ship_type = function () {
  type = undefined;
  $('.ship_type input:radio').each(function() {
    if ($(this).attr('checked') == 'checked') { type = $(this).attr('value'); }
  })
  return type;
};
