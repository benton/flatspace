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

    // Create all player ships
    Players.find().forEach(function (player) {
      var this_ship = Crafty.e("FlatSpacePlayerShip")
        .set_ship_options({
          player_name: player.name,
          ship_color: player.color,
          db_id: player._id,
          x: player.pos_x, y: player.pos_y, w: 8, h: 8
        });
      // Add Fourway controls if this ship's name matches the login name
      if (player.name === player_name) {
        this_ship.addComponent("PositionBroadcaster");
        console.log(this_ship);
        this_ship.fourway(3);
      }
    });
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
