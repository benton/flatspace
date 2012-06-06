// Event list
Template.login_screen.events = {
  
  // When the loginout button is clicked...
  'click input.loginout': function () {
    if ($("input.loginout").attr('value') === 'Login as:') {
      // Login
      Session.set("player_name", $("input.username").attr('value'));
      console.log("Logging in as "+ Session.get("player_name"));
      $("input.username").attr('disabled', true);
      $("input.username").attr('blur', true);
      $("input.loginout").attr('value', 'Logout');
      fspace.login(Session.get("player_name"));  // Start the game
    }
    else {
      // Logout
      console.log("Logging out "+ Session.get("player_name"));
      Session.set("player_name", null);
      $("input.username").attr('disabled', false);
      $("input.username").attr('value', '');
      $("input.loginout").attr('value', 'Login as:');
      fspace.logout();
    };
  }
  
};
