// On server startup, create some players if the database is empty.
Meteor.startup(function () {
  var names = [ "My Little Pwnie", "benton", "Diderot", "Stravinsky", "ed"];
  var colors = ["red", "yellow", "blue"];
  var types = ["Pilot", "Gunner", "Defender"];
  if (Players.find().count() === 0) {
    for (var i = 0; i < names.length; i++)
      Players.insert({
        name:  names[i],
        type:  types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        pos_x: Math.floor(Math.random()*300),
        pos_y: Math.floor(Math.random()*300),
        score: Math.floor(Math.random()*10)*5
      });
  }
});
