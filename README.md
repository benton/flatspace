Flatspace
================
An experiment in real-time, multiplayer, browser-based gaming.

  *SKELETON PROOF-OF-CONCEPT VERSION - just moves shapes on the screen!*


----------------
What is it?
----------------
Flatspace is an experiment in building a real-time, multiplayer game that runs in modern web browsers. I have a few initial game features in the project backlog, but at the moment, the game just moves colored dots around on the screen.


----------------
Why is it?
----------------
Flatspace is a personal learning project, primarily intended to sharpen my Javascript skills and deepen my expertise with some of the modern Javascript frameworks. Among the technologies in use so far:

    * JQuery
    * Node.js
    * WebSockets
    * MongoDB
    * HTML5 Canvas / Vector drawing


----------------
Where is it? (Playing)
----------------
[Flatspace Demo](http://flatspace.meteor.com)

Choose an existing player from the login screen by clicking on a name from the list, or type a new name in the text field. Click the login button and the game screen should appear. Use the arrow keys or WSAD on your keyboard to move your very own colored dot.

Other players' dots should move around on your screen as they play from elsewhere.


----------------
How is it [done]? (Overall Architecture)
----------------
The game glues together two open-source, event-driven frameworks: [Meteor](http://meteor.com), and [Crafty.js](http://craftyjs.com).

Meteor is a client-server framework written entirely in Javascript, which provides the ability to "mirror" APIs between the browser and the [Node.js](http://nodejs.org/) server -- most notably, proxying the server-side database API to the client. So game state is modeled on the server side in [MongoDB](http://www.mongodb.org/), and changes pushed by any client are automatically propagated by Meteor to all connected browsers.

The Flatspace code glues DB change events to an open-source game creation toolkit, [Crafty.js](http://craftyjs.com/). Since Crafty.js is also event-based, Flatspace implements some Crafty game Components that are responsible for:

1. listening for important events in the local game engine,
  and pushing them as database documents to the server; and

2. listening for remote database changes, and applying them as
  updated game state to the local Crafty game engine entities.

    [[ DIAGRAM TO FOLLOW]]


----------------
*Known Limitations / Bugs*

* It's _really_ latent. Remote players appear to jump on the screen as position updates arrive irregularly. I have not yet begun to optimize.  :-)


----------------
Development / Contribution
----------------
I will be documenting game ideas and more architecture at some point, but if you *must* run it locally right away, try this:

1. Clone the project

2. Install Meteor

3. Run 'meteor' from the project directory and visit http://localhost:3000/






