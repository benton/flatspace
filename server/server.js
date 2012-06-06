// On server startup, create some players if the database is empty.
Meteor.startup(function () {
  if (Players.find().count() === 0) {
    var names = ["Ada Lovelace",
                 "Grace Hopper",
                 "Marie Curie",
                 "Carl Friedrich Gauss",
                 "Nikola Tesla",
                 "Claude Shannon"];
    for (var i = 0; i < names.length; i++)
      Players.insert({
        name:  names[i],
        pos_x: Math.floor(Math.random()*300),
        pos_y: Math.floor(Math.random()*300),
        score: Math.floor(Math.random()*10)*5
      });
  }
});
