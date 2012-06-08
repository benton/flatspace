// The component manager module encapsulates the Crafty.js component definitions
var fspace_components = function () {

  //**** PRIVATE METHODS ****//

  // Sets up the Crafty.js game components
  function setupCrafyComponents() {

    // Create a component that includes the logic for pointing
    // to a persistent proxy object in the Node.js database
    Crafty.c("PersistentProxy", {
      // Sets the master or slave role
      _persistent_proxy_role: 'slave',
      _db_id: null,
      set_role: function (role_name) {
        this._persistent_proxy_role = role_name;
        return this;
      },
      // Returns a game-wide unique ID for this persistent game object
      game_id: function () { return this._db_id; },

      // The Node.js database collection name for this game entity
      collection: function () { return Players; },
    });

    // Create a component that tracks position and saves it
    // in a document in a Meteor collection on the server
    Crafty.c("PositionBroadcaster", {
      init: function() {
        this.requires("PersistentProxy, 2D, Fourway");
        this.set_role('master');
        // Push position updates into the Meteor database collection
        this.bind("Move", function(old_pos) {
          Players.update(
            this.game_id(), {$set: {pos_x: this._x, pos_y: this._y}}
          );
        });
        return this;
      }
    });

    // Create a component that tracks position attributes in a Meteor
    // datastore document, and applies them to a Crafty entity
    Crafty.c("PositionListener", {
      init: function() {
        var collection  = this.collection();
        var id          = this.game_id();
        var slave       = this;
        this.requires("PersistentProxy, 2D");
        this.set_role('slave');
        // Listen for Meteor doc updates
        Meteor.autosubscribe(function () {
          collection.find({ _id: id }).forEach( function(player_doc) {
            slave._x = player_doc.pos_x;
            slave._y = player_doc.pos_y;
            //slave.undraw(); // Would prefer to undraw a Canvas entity
            slave.draw();
          });
        });
        return this;
      }
    });

    // Create a component that tracks position and saves it
    // in a document in a Meteor collection on the server
    Crafty.c("FlatSpacePlayerShip", {
      _player_name: 'unknown',
      set_ship_options: function(options) {
        this.requires("PersistentProxy, 2D, DOM, Color");
        this._player_name = options.player_name;
        this.color(options.ship_color);   // for Component Color
        this.attr({                       // for Componenet 2D
          x: options.x, y: options.y, w: options.w, h: options.h,
        });
        this._db_id = options.db_id;
        return this;
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
