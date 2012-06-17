// The component manager module encapsulates the Crafty.js component definitions
var fspace_components = function () {

  //**** PRIVATE METHODS ****//

  // Sets up the Crafty.js game components
  function setupCrafyComponents() {

    // Create a component that includes the logic for pointing
    // to a persistent proxy object in the Node.js database
    Crafty.c("PersistentProxy", {
      _db_id: null,
      // Returns a game-wide unique ID for this persistent game object
      game_id: function () { return this._db_id; },
      // The Node.js database collection name for this game entity
      collection: function () { return Players; },
    });

    // Create a component that tracks position and saves it
    // in a document in a Meteor collection on the server
    Crafty.c("PositionBroadcaster", {
      init: function() {
        this.requires("PersistentProxy, 2D");
        // Push position updates into the Meteor database collection
        this.bind("PushPersistentData", function() {
          Players.update(
            this.game_id(), {$set: {pos_x: this._x, pos_y: this._y}}
          );
        });
        return this;
      }
    });

    // Create a component that tracks position attributes in a Meteor
    // datastore document, and applies them to a Crafty entity
    Crafty.c("2DListener", {
      init: function() {
        this.requires("PersistentProxy, 2D").origin("center");
        var collection  = this.collection();
        var id          = this.game_id();
        var slave       = this;
        // Listen for Meteor doc updates
        Meteor.autosubscribe(function () {
          collection.find({ _id: id }).forEach( function(player_doc) {
            slave.x = player_doc.pos_x;
            slave.y = player_doc.pos_y;
            if (player_doc.rot) { slave.rotation  = player_doc.rot; };
          });
        });
        return this;
      }
    });

    // Create a component that tracks rotation and saves it
    // in a document in a Meteor collection on the server
    Crafty.c("RotationBroadcaster", {
      init: function() {
        this.requires("PersistentProxy, 2D");
        // Push rotation updates into the Meteor database collection
        this.bind("PushPersistentData", function() {
          Players.update(
            this.game_id(), {$set: {rot: this.rotation}}
          );
        });
        return this;
      }
    });


    // Create a component that models data for a player ship
    Crafty.c("FlatSpacePlayerShip", {
      _player_name: 'unknown',
      _color:       'gray',
      _mass:        5000,
      _thrust:      100,
      _spin_speed:  3,
      _max_speed:   2,
      _min_speed:   0.001,

      init: function() {
        this.requires("PersistentProxy, 2D, DOM");
        this.bind('KeyDown', function(e) {
          if (e.key === Crafty.keys['ESC']) { fsClient.logout(); }
        });
        return this;
      },

      set_ship_options: function(options) {
        this._player_name = options.player_name;
        this._color       = options.ship_color;
        this._db_id       = options.db_id;
        this.attr({       // for Componenet 2D
          x: options.x, y: options.y, w: options.w, h: options.h,
          rotation: options.rotation
        });
        return this;
      }
    });

    // Create circular player ship - a "Defender"
    Crafty.c("FlatSpaceDefender", {
      init: function() {
        this.requires("FlatSpacePlayerShip");
        var strokew = 1;
        var pen     = new jxPen(new jxColor("white"), strokew);
        var brush   = new jxBrush(new jxColor(this._color));
        var center  = new jxPoint(this._w / 2, this._h / 2);
        var radius  = (this._w / 2) - strokew;
        var circle  = new jxCircle(center, radius, pen, brush);
        circle.draw(new jxGraphics(this._element));
        return this;
      },
    });

    // Create square player ship - a "Gunner"
    Crafty.c("FlatSpaceGunner", {
      init: function() {
        this.requires("FlatSpacePlayerShip");
        var strokew = 1;
        var pen     = new jxPen(new jxColor("white"), strokew);
        var brush   = new jxBrush(new jxColor(this._color));
        var origin  = new jxPoint(strokew, strokew);
        var size    = this._w - (strokew * 2);
        var square  = new jxRect(origin, size, size, pen, brush);
        square.draw(new jxGraphics(this._element));
        return this;
      },
    });

    // Create triangular player ship - a "Pilot"
    Crafty.c("FlatSpacePilot", {
      init: function() {
        this.requires("FlatSpacePlayerShip");
        var strokew = 1;
        var pen       = new jxPen(new jxColor("white"), strokew);
        var brush     = new jxBrush(new jxColor(this._color));
        var bot_left  = new jxPoint(strokew, this.h - strokew);
        var bot_right = new jxPoint(this._w - (strokew * 2), this.h - strokew);
        var top       = new jxPoint(this._w / 2, strokew);
        var triangle  = new jxPolygon([bot_left, bot_right, top], pen, brush);
        triangle.draw(new jxGraphics(this._element));
        return this;
      },
    });

    // Create component with the default movement controls
    Crafty.c("FlatSpaceMovementControl", {
      init: function() {
        this._vx = 0;  // initial horizontal velocity
        this._vy = 0;  // initial vertical velocity

        this.requires("Keyboard, FlatSpacePlayerShip").origin("center");
        this.bind("EnterFrame", function() {
    			var angle = this._rotation * (Math.PI / 180); // in radians
    			var accel_x = Math.sin(angle) * this._thrust / this._mass;
    			var accel_y = -Math.cos(angle) * this._thrust / this._mass;

          // Spin left or right
  				if (this.isDown(Crafty.keys.A)) { this.rotation -= this._spin_speed;}
  				else
  				if (this.isDown(Crafty.keys.D)) { this.rotation += this._spin_speed; }
          // Forward Thrust
    			if(this.isDown(Crafty.keys.W) || this.isDown(Crafty.keys.UP_ARROW)) {
    				this._vx = Math.round((this._vx + accel_x) * 100) / 100;
    				this._vy = Math.round((this._vy + accel_y) * 100) / 100;
    			} else
    			// Reverse Thrust
    			if(this.isDown(Crafty.keys.S) || this.isDown(Crafty.keys.DOWN_ARROW)) {
    				this._vx = Math.round((this._vx - accel_x) * 100) / 100;
    				this._vy = Math.round((this._vy - accel_y) * 100) / 100;
    			}
  				if (Math.abs(this._vx) > this._max_speed) { this._vx = this._max_speed };
  				if (Math.abs(this._vy) > this._max_speed) { this._vy = this._max_speed };
    			// Update position
    			this.x = Math.round((this.x + this._vx) * 100) / 100;
    			this.y = Math.round((this.y + this._vy) * 100) / 100;
    		});
        return this;
      },
    });

  };

  //**** PUBLIC METHODS ****//

  return {
    // Initialize is a public method that sets up the Crafy Components.
    initialize: function () {
      setupCrafyComponents();
    }
  };

}();
