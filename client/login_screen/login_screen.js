Template.login_screen.player_name = function () {
  return Session.get("player_name") || "player";
}

// Event list
Template.login_screen.events = {
  
  // When the loginout button is clicked...
  'click input.loginout': function () {
    if ($("input.loginout").attr('value') === 'Login as:') {
      // Login
      username = $("input.username").attr('value');
      Session.set("username", username);
      $("input.username").attr('disabled', true);
      $("input.username").attr('blur', true);
      $("input.loginout").attr('value', 'Logout');
      console.log("Logging in as "+ username);
      fspace.login(username);  // Start the game
    }
    else {
      // Logout
      $("input.username").attr('disabled', false);
      $("input.loginout").attr('value', 'Login as:');
      console.log("Logging out "+ Session.get("username"));
      fspace.logout();
    };
  }
  
};
