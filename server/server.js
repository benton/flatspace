// On server startup, create some players if the database is empty.
Meteor.startup(function () {
  var names = ["al", "ben", "cal", "don", "ed"];
  var colors = ["red", "yellow", "blue"];
  if (Players.find().count() === 0) {
    for (var i = 0; i < names.length; i++)
      Players.insert({
        name:  names[i],
        color: colors[Math.floor(Math.random() * colors.length)],
        pos_x: Math.floor(Math.random()*300),
        pos_y: Math.floor(Math.random()*300),
        score: Math.floor(Math.random()*10)*5
      });
  }
});
