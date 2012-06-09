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

Template.leaderboard.events = {
  'click input.move_up': function () {
    Players.update(Session.get("selected_player"), {$inc: {pos_y: 5}});
  },
  'click input.move_left': function () {
    Players.update(Session.get("selected_player"), {$inc: {pos_x: -5}});
  },
  'click input.move_right': function () {
    Players.update(Session.get("selected_player"), {$inc: {pos_x: 5}});
  },
  'click input.move_down': function () {
    Players.update(Session.get("selected_player"), {$inc: {pos_y: -5}});
  },
  'click input.inc': function () {
    Players.update(Session.get("selected_player"), {$inc: {score: 5}});
  },
  'click input.del': function () {
    Players.remove(Session.get("selected_player"));
  }
};

Template.player.events = {
  'click': function () {
    Session.set("selected_player", this._id);
    $("input.username").attr('value', this.name);
  }
};
