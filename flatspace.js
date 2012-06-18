// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players."
Players = new Meteor.Collection("players");


// The top-level FlatSpace module.
// Provides the following public methods:
//    * login(username)
//    * logout()
//    * msg(log_message)
var fSpace = function () {

  //**** PRIVATE ATTRIBUTES ****//
  var ship_colors     = ["red", "yellow", "blue"];
  var ship_types      = ["Pilot", "Gunner", "Defender"];
  //**** PRIVATE METHODS ****//

  return {
    //**** PUBLIC METHODS ****//

    createNewPlayer: function (player_name, type, color) {
      color = color || ship_colors[Math.floor(Math.random() * ship_colors.length)];
      type  = type || ship_types[Math.floor(Math.random() * ship_types.length)];
      // Create the player if the name doesn't already exist
      if (Players.find({name: player_name}).fetch().length < 1) {
        Players.insert({
          name:   player_name,
          type:   type,
          color:  color,
          pos_x:  Math.floor(Math.random()*300),
          pos_y:  Math.floor(Math.random()*300),
          rot:    0,
          score:  Math.floor(Math.random()*10)*5
        });
      }
    },

  };
}();
