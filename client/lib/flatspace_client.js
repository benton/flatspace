// The top-level FlatSpace module.
// Provides the following public methods:
//    * login(username)
//    * logout()
//    * msg(log_message)
var fspace = function () {

  //**** PRIVATE ATTRIBUTES ****//
  var player_name     = 'unknown';
  var initialized     = false;
  var log_to_console  = false;

  //**** PRIVATE METHODS ****//

  // Initilize is a private method that sets up the frameworks.
  // It's called when the user logs in.
  function initialize() {
    if (initialized === false) {
      log_meteor_connection_status();
      fspace_components.initialize();
      setupCraftyStage();
      this.initialized = true;
      if (window.location.hostname === 'localhost') { log_to_console = true; }
    }
  };

  // Sets up the Crafty.js Stage
  function setupCraftyStage() {
    var WIDTH = $(window).width() - 20, HEIGHT = $(window).height() - 110;
    Crafty.init(WIDTH, HEIGHT); // Initialize Crafty
  };

  // start the simulation: (draw the players)
  function startSimulation() {
    // Create all player ships
    Players.find().forEach(function (player) {
      var this_ship = Crafty.e("FlatSpacePlayerShip")
        .set_ship_options({
          player_name: player.name,
          ship_color: player.color,
          db_id: player._id,
          x: player.pos_x, y: player.pos_y, w: 20, h: 20
        });
      // Add Fourway controls if this ship's name matches the login name
      if (player.name === player_name) {
        this_ship.addComponent("PositionBroadcaster");
        this_ship.fourway(1);
      } else {
        this_ship.addComponent("PositionListener");
      };
      // (for now, everyone's a Defender)
      this_ship.addComponent("FlatSpaceDefender");
    });
  };

  // Log the connection status to the server
  function log_meteor_connection_status() {
    var update = function () {
      var ctx = new Meteor.deps.Context();  // invalidation context
      ctx.on_invalidate(update);            // rerun update() on invalidation
      ctx.run(function () {
        var is_connected = Meteor.status().connected;
        var connection_status = Meteor.status().status;
        if (is_connected) {
          fspace.msg("Connected to game server");
        } else {
          fspace.msg("Disconnected from game server. "+ connection_status);
        };
      });
    };
    update();
  };


  return {
    //**** PUBLIC METHODS ****//

    // The login method is the entry point for the FlatSpace API.
    login: function (username) {
      player_name = $.trim(username);
      if (player_name.length === 0) {
        fspace.msg("Please enter a new or existing player name");
        return false;
      }
      initialize();
      var colors = ["red", "yellow", "blue", "green", "orange", "purple"];
      // Create the player if the name doesn't already exist
      if (Players.find({name: player_name}).fetch().length < 1) {
        fspace.msg("Creating new player "+ player_name)
        Players.insert({
          name:  player_name,
          color: colors[Math.floor(Math.random() * colors.length)],
          pos_x: Math.floor(Math.random()*300),
          pos_y: Math.floor(Math.random()*300),
          score: Math.floor(Math.random()*10)*5
        });
      }
      fspace.msg("Logged in as "+ player_name);
      startSimulation();
      return true;
    },

    // The login method is the entry point for the FlatSpace API.
    logout: function () {
      //Crafty.stop(); // This is throwing an exception -- not sure why
      fspace.msg("Logged out");
      window.location.reload()
      return true;
    },

    // Puts a String message into the Meteor Session as fspace_status.
    // Logs a message to the console if logging is set with
    // log_to_console(true)
    msg: function (msg) {
      Session.set("fspace_status", msg);
      if (log_to_console) { console.log(msg); }
    },

    // Sets whether or not to log messages to the console
    log_to_console: function (true_or_false) {
      log_to_console = true_or_false;
    }

  };
}();
