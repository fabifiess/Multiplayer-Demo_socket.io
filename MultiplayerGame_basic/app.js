/**
 * app.js
 * Server for a simple multiplayer game
 * 20151128, Fabian Fiess, fabi.images@gmail.com
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};

// include external data, eg. css, images (public folder)
app.use(express.static(__dirname + '/public'));

// By typing localhost:3000 the browser will load index.html
app.get('/', function (req, res) {
    res.redirect('/html/index.html'); // alternative: res.sendfile('./public/html/index.html');
});

// Put the application on port 3000
var port = 3000;
http.listen(port, function () {
    console.log('listening on port ' + port);
});

// Socket.io: Communication Server <-> Client(s)
io.on('connection', function (socket) {
    var client_ip = socket.request.connection.remoteAddress;


    // New client is getting connected
    if (!(contains(clients, client_ip))) {
        var socket_data={};

        /**
         * 1. socket.emit sends the data of all connected clients only to the new one
         */

        console.log("Existing players: " + JSON.stringify(clients));
        socket.emit("drawExistingPlayers", clients);

        /**
         * 1.1. Add new client
         */

        socket_data.clientColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        socket_data.posX = Math.floor((Math.random() * 1300) + 0);
        socket_data.posY = Math.floor((Math.random() * 700) + 0);

        clients[client_ip] = socket_data;
        console.log("New Player: " + JSON.stringify(clients[client_ip]));
        console.log("All connected clients: " + JSON.stringify(clients));

        /**
         * 2. io.emit sends the data of the newly added client to all connected clients
         */

        var newPlayer={
            key: client_ip,
            val: clients[client_ip]
        }
        io.emit("drawNewPlayer", newPlayer);
    }

    /**
     * 3. When one client changes the position of its player, the server sends the new
     * position to all connected clients.
     */

    socket.on('newPosition', function (data) {
        console.log("Position changed: " + JSON.stringify(data));
        clients[data.client_ip].posX= data.posX;
        clients[data.client_ip].posY= data.posY;
        io.emit('newPosition', data);
    });

    // One client tries to connect with multiple browsers
    if ((contains(clients, client_ip))) {
        console.log("doubleConnection: "+client_ip);
        socket.emit("doubleConnection", "You can\'t create more than one player on the same device");
    }

    /**
     * When on client disconnects, it is deleted from the clients collection
     * and the server tells its clients to delete the representing div element.
     */
    socket.on('disconnect', function () {
        console.log(client_ip + ' disconnected');
        io.emit('player_disconnect', client_ip);
        delete clients[client_ip];
        console.log("All connected clients: " + JSON.stringify(clients));
    });
});

function contains(array, value) {
    for (var key in array) {
        if (array[key] == value) {
            return true;
        }
    }
    return false;
}