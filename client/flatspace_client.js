// the top-level FlatSpace module
// provides public methods:
//  * login(username)
var fspace = function () {

  //**** PRIVATE METHODS ****//

  // Initilize is a private method that sets up the frameworks.
  // It's called when the user logs in.
  function initialize() {
    setupCrafyComponents();
    setupCraftyStage();
    startSimulation();
  };

  // Sets up the Craft.js game components
  function setupCrafyComponents() {
    // Create a component that includes the logic for pointing
    // to a persistent proxy object in the Node.js database
    Crafty.c("PersistentProxy", {
        init: function () {
          console.log("Setting up game entity "+ this.game_id +
          " in "+ this.collection)
        },
        // Sets the master or slave role
        set_role: function (role_name) {
          this._persistent_proxy_role = role_name;
          return this;
        },
        // Returns a game-wide unique ID for this persistent game object
        game_id: function () {
          return Session.get("selected_player");
        }(),
        // The Node.js database collection name for this game entity
        collection: function () {
          return Players;
        }(),
    });

    // Create a component that tracks position and saves it
    // in a document in a Meteor collection on the server
    Crafty.c("PositionBroadcaster", {
        init: function() {
          this.requires("PersistentProxy");
          this.bind("Move", function(old_pos) {
            console.log("Setting position of "+ this.game_id);
            this.collection.update(
              this.game_id, {$set: {pos_x: this._x, pos_y: this._y}}
            );
          });
        }
    });
  };

  // Sets up the Crafty.js Stage
  function setupCraftyStage() {
    var WIDTH = $(window).width() - 20, HEIGHT = 360;
    // Initialize Crafty
    Crafty.init(WIDTH, HEIGHT);
  };

  // start the simulation: (draw the player)
  function startSimulation() {
    /*
     * Create an entity with Crafty.e(..) that
     *  - can be drawn (2D) on a HTML canvas (Canvas)
     *  - has a background color (Color)
     *  - can be moved with WASD or arrow keys (Fourway)
     */
    var pl = Crafty.e("2D, Canvas, Color, Fourway, PositionBroadcaster")
                .attr({x: 160, y: 96, w: 8, h: 8}) // for Component 2D
                .color("#FF0000")     // for Component Color
                .fourway(10)          // for Component Fourway
                .set_role('master');  // for PersistentProxy
    // log the created entity to the JS console
    console.log(pl);
  };

  return {

    //**** PUBLIC METHODS ****//

    // The login method is the entry point for the FlatSpace API.
    login: function (username) {
      console.log("Logged in as "+ username);
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
