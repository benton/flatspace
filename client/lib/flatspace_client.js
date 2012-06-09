// the top-level FlatSpace module
// provides public methods:
//  * login(username)
var fspace = function () {

  //**** PRIVATE ATTRIBUTES ****//
  var player_name = 'unknown';
  var initialized = false;

  //**** PRIVATE METHODS ****//

  // Initilize is a private method that sets up the frameworks.
  // It's called when the user logs in.
  function initialize() {
    if (initialized === false) {
      fspace_components.initialize();
      setupCraftyStage();
      this.initialized = true;
    }
    startSimulation();
  };

  // Sets up the Crafty.js Stage
  function setupCraftyStage() {
    var WIDTH = $(window).width() - 20, HEIGHT = $(window).height() - 80;
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
        this_ship.fourway(3);
      } else {
        this_ship.addComponent("PositionListener");
      }
    });
  };

  return {

    //**** PUBLIC METHODS ****//

    // The login method is the entry point for the FlatSpace API.
    login: function (username) {
      player_name = username;
      var colors = ["red", "yellow", "blue", "green"];
      // Create the player if the name doesn't already exist
      if (Players.find({name: player_name}).fetch().length < 1) {
        console.log("Creating new player "+ player_name)
        Players.insert({
          name:  player_name,
          color: colors[Math.floor(Math.random() * colors.length)],
          pos_x: Math.floor(Math.random()*300),
          pos_y: Math.floor(Math.random()*300),
          score: Math.floor(Math.random()*10)*5
        });
      }
      console.log("Logged in as "+ player_name);
      initialize();
      return true;
    },

    // The login method is the entry point for the FlatSpace API.
    logout: function () {
      //Crafty.stop(); // This is throwing an exception -- not sure why
      console.log("Logged out");
      window.location.reload()
      return true;
    }

  };
}();
