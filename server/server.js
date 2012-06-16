// On server startup, create some players if the database is empty.
Meteor.startup(function () {
  var names = [ "My Little Pwnie", "benton", "Diderot", "Stravinsky", "ed"];
  if (Players.find().count() === 0) {
    for (var i = 0; i < names.length; i++) { fSpace.createNewPlayer(names[i]); }
  }
});
