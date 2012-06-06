// The component manager module encapsulates the Crafty.js component definitions
var fspace_components = function () {

  //**** PRIVATE METHODS ****//

  // Sets up the Crafty.js game components
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

  //**** PUBLIC METHODS ****//

  return {
    // Initilize is a public method that sets up the Crafy Components.
    initialize: function () {
      setupCrafyComponents();
    }
  };

}();
