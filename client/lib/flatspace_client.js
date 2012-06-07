// the top-level FlatSpace module
// provides public methods:
//  * login(username)
var fspace = function () {

  //**** PRIVATE ATTRIBUTES ****//
  var player_name = 'unknown';

  //**** PRIVATE METHODS ****//

  // Initilize is a private method that sets up the frameworks.
  // It's called when the user logs in.
  function initialize() {
    fspace_components.initialize();
    setupCraftyStage();
    startSimulation();
  };

  // Sets up the Crafty.js Stage
  function setupCraftyStage() {
    var WIDTH = $(window).width() - 20, HEIGHT = 360;
    // Initialize Crafty
    Crafty.init(WIDTH, HEIGHT);
  };

  // start the simulation: (draw the player)
  function startSimulation() {

    // Create the player ship
    var player_ship = Crafty.e("FlatSpacePlayerShip")
      .set_ship_options({
        player_name: player_name,
        x: 160, y: 96, w: 8, h: 8,
        ship_color: "#FF0000",
        ship_speed: 3
      })

    console.log(player_ship);  // log the created entity to the JS console
  };

  return {

    //**** PUBLIC METHODS ****//

    // The login method is the entry point for the FlatSpace API.
    login: function (username) {
      player_name = username;
      console.log("Logged in as "+ player_name);
      initialize();
      return true;
    },

    // The login method is the entry point for the FlatSpace API.
    logout: function () {
      Crafty.stop(); // This is throwing an exception -- not sure why
      console.log("Logged out");
      window.location.reload()
      return true;
    }

  };
}();
