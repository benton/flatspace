Template.login_screen.selected_player_name = function () {
  return Session.get("player_name") || "";
};

Template.login_screen.status_message = function () {
  return Session.get("fspace_status");
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


// Event list
Template.login_screen.events = {

  // When the loginout button is clicked...
  'click input.loginout': function () {
    if ($("input.loginout").attr('value') === 'Login as:') {
      // Login
      username = $("input.username").attr('value');
      Session.set("username", username);
      fspace.msg("Logging in as "+ username);
      fspace.login(username);  // Start the game
      Meteor.flush();
    }
    else {
      // Logout
      $("input.username").attr('disabled', false);
      fspace.msg("Logging out "+ Session.get("username"));
      Session.set("username", null);
      fspace.logout();
    };
  }

};
