// The top-level FlatSpace module.
// Provides the following public methods:
//    * login(username)
//    * logout()
//    * msg(log_message)
var fsClient = function () {

  //**** PRIVATE ATTRIBUTES ****//
  var player_name     = 'unknown';
  var initialized     = false;
  var log_to_console  = false;
  var ship_colors     = ["red", "yellow", "blue"];
  var ship_types      = ["Pilot", "Gunner", "Defender"];
  var update_interval = 100; // How often to push data to server, in mSec

  //**** PRIVATE METHODS ****//

  // Initilize is a private method that sets up the frameworks.
  // It's called when the user logs in.
  function initialize() {
    if (initialized === false) {
      log_meteor_connection_status();
      fspace_components.initialize();
      if (window.location.hostname === 'localhost') { log_to_console = true; }
      this.initialized = true;
    }
  };

  // Sets up the Crafty.js Stage
  function setupCraftyStage() {
    var WIDTH = $(window).width() - 20, HEIGHT = $(window).height() - 110;
    Crafty.init(WIDTH, HEIGHT); // Initialize Crafty
  };

  // start the simulation: (draw the players)
  function startSimulation() {
    setupCraftyStage();
    // Create all player ships
    Players.find().forEach(function (player) {
      var this_ship = Crafty.e("FlatSpacePlayerShip")
        .set_ship_options({
          player_name: player.name,
          ship_color: player.color,
          db_id: player._id,
          x: player.pos_x, y: player.pos_y, w: 20, h: 20,
          rotation: player.rot
        });
      // Add movement controls and position pushing
      // if this ship's name matches the login name
      if (player.name === player_name) {
        this_ship.addComponent("PositionBroadcaster");
        this_ship.addComponent("RotationBroadcaster");
        this_ship.addComponent("FlatSpaceMovementControl");
      } else {
        this_ship.addComponent("2DListener");
      };
      // Add the specific player class
      this_ship.addComponent("FlatSpace"+ player.type);
    });
    // Start pushing persistent data to the server
    Meteor.setInterval(
      function () { Crafty.trigger("PushPersistentData"); },
      update_interval
    );
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
          fsClient.msg("Connected to game server");
        } else {
          fsClient.msg("Disconnected from game server. "+ connection_status);
        };
      });
    };
    update();
  };

  return {
    //**** PUBLIC METHODS ****//

    // The login method is the entry point for the FlatSpace API.
    // username is required - type and color are optional
    login: function (username, type, color) {
      player_name = $.trim(username);
      if (player_name.length === 0) {
        fsClient.msg("Please enter a new or existing player name");
        return false;
      }
      initialize();
      // Create the player if the name doesn't already exist
      if (Players.find({name: player_name}).fetch().length < 1) {
        fsClient.msg("Creating player "+ player_name);
        fSpace.createNewPlayer(player_name, type, color);
      }
      fsClient.msg("Logged in as "+ player_name);
      startSimulation();
      return true;
    },

    // The login method is the entry point for the FlatSpace API.
    logout: function () {
      //Crafty.stop(); // This is throwing an exception -- not sure why
      fsClient.msg("Logged out");
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
