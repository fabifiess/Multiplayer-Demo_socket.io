/**
 * app.js
 * Server for a simple multiplayer game
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients_old = [];
var clientColors = [];
var posX = [];
var posY = [];
var clients = {};
//clients["eins"] = "one";
//clients["zwei"] = "two";



if (contains(clients, "dd"))console.log("vorhanden");
if (!(contains(clients, "dd")))console.log("nicht vorhanden");



// include external data, eg. css, images (public folder)
app.use(express.static(__dirname + '/public'));

// By typing localhost:3000 the browser will load index.html
app.get('/', function (req, res) {
    res.redirect('/html/index.html'); // alternative: res.sendfile('./public/html/index.html');
});

// Put the application on port 3000
http.listen(3000, function () {
    console.log('listening on: 3000');
});

// Socket.io: Communication Server <-> Client(s)
io.on('connection', function (socket) {
    var client_ip = socket.request.connection.remoteAddress;
    if ((contains(clients, client_ip))) {
        socket.emit("doubleConnection", "You can\'t create more than one player on the same device");
    }
    // New client is getting connected
    if (!(contains(clients, client_ip))) {
        console.log(client_ip);
        console.log(clients);
        var clientNumber = array_length(clients); //= clients.length;








        /**
         * 1. socket.emit sends the data of all connected clients only to the new one
         */

        var allPlayers = {
            client_id: clientNumber,
            clientColors: clientColors,
            posX: posX,
            posY: posY
        };

        console.log("Existing players: " + JSON.stringify(allPlayers));
        socket.emit("drawExistingPlayers", allPlayers);

        /**
         * 1.1. Add new client
         */

        clients[client_ip] = client_ip;
        clientColors[clientNumber] = '#' + Math.floor(Math.random() * 16777215).toString(16);
        posX[clientNumber] = Math.floor((Math.random() * 1300) + 0);
        posY[clientNumber] = Math.floor((Math.random() * 700) + 0);

        /**
         * 2. io.emit sends the data of the newly added client to all connected clients
         */

        var newPlayer = {
            client_id: clientNumber,
            color: clientColors[clientNumber],
            posX: posX[clientNumber],
            posY: posY[clientNumber],
        };

        console.log("New player: " + JSON.stringify(newPlayer));
        io.emit("drawNewPlayer", newPlayer);
    }

    /**
     * 3. When one client changes the position of its player, the server sends the new
     * position to all connected clients.
     */

    socket.on('newPosition', function (data) {
        console.log("Change position: " + JSON.stringify(data));
        posX[data.client_id] = data.posX;
        posY[data.client_id] = data.posY;
        io.emit('newPosition', data);
    });

    socket.on('disconnect', function () {
        console.log(client_ip + ' disconnected');
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

function array_length(array) {
    var i = 0;
    for (var key in array) {
        i++;
    }
    return i;
}

/*
 function contains_old(array, obj) {
 for (i = 0; i < array.length; i++) {
 if (array[i] === obj) {
 return true;
 }
 }
 return false;
 }
 */