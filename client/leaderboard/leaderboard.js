Template.leaderboard.loggedin = function () {
  if (Session.get("username")) { return true; }
  return false;
};

Template.leaderboard.players = function () {
  return Players.find({}, {sort: {score: -1, name: 1}});
};

Template.leaderboard.selected_name = function () {
  var player = Players.findOne(Session.get("selected_player"));
  return player && player.name;
};

Template.player.selected = function () {
  return Session.equals("selected_player", this._id) ? "selected" : '';
};

Template.player.events = {
  'click': function () {
    Session.set("selected_player", this._id);
    $("input.username").attr('value', this.name);
  }
};
