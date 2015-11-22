// 03: + Socket.io

// Benötigte Module laden
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var colorCollection = ["#ffff00", "#db0031", "#ff00ff", "#00ffff", "#00ff00", "#ff0000", "#0000ff"]
var clients = ["client1","client2"];
var clientColors = ["#ff0000", "#13579b"];
var posX = [100, 300];
var posY = [100, 300];


// bei localhost:3000 erscheint index.html
app.get('/', function (req, res) {
    res.sendfile('./public/index.html');
});

// externe Dateien einbinden, zB css, Bilder (im public folder)
app.use(express.static(__dirname + '/public'));

// Socket.io: Kommunikation Server <-> Clients

io.on('connection', function (socket) {





// Neuer Client meldet sich an
    if (!(contains(clients, socket.id))) {


        var currentNumber = clients.length;
        /**
         * socket.emit sendet die Daten ALLER vorhandenen Clients
         * NUR an den neuen Client
         */

        var allPlayers = {
            currentNumber: currentNumber,
            clientColors: clientColors,
            posX: posX,
            posY: posY
        };


        socket.emit("drawExistingPlayers", allPlayers);



        /**
         * add new client
         */



        clients.push(socket.id);

        clientColors[currentNumber] = colorCollection[currentNumber];
        posX[currentNumber] = Math.floor((Math.random() * 1400) + 0);
        posY[currentNumber] = Math.floor((Math.random() * 900) + 0);


        console.log("currentNumber: " + currentNumber.toString());
        console.log("client: " + clients[currentNumber]);
        console.log("clientColor: " + clientColors[currentNumber]);
        console.log("posX: " + posX[currentNumber]);
        console.log("posY: " + posY[currentNumber]);



        /**
         * io.emit sendet die Daten des eben hinzugefügten Clients an ALLE verbundenen Clients.
         * socket.emit dagegen sendet nur an den Client, der sich soeben angemeldet hat
         */


        var newPlayer = {
            currentNumber: currentNumber,
            new_color: clientColors[currentNumber],
            new_posX: posX[currentNumber],
            new_posY: posY[currentNumber]
        };

        console.log("newPlayer.color: " + newPlayer.new_color);
        console.log("newPlayer.posX: " + newPlayer.new_posX);
        console.log("newPlayer.posY: " + newPlayer.new_posY);



        io.emit("drawNewPlayer", newPlayer);
    }


    socket.on('newPosition', function (data) {

        console.log("Position Click: "+ JSON.stringify(data));
        posX[data.client_id]= data.posX;
        posY[data.client_id]= data.posY;
        io.emit('newPosition', data);
    });

    console.log("------------------------------------------------------------------")
});

// End

// lege die Applikation auf localhost: 3000
http.listen(3000, function () {
    console.log('listening on: 3000');
});

function contains(array, obj) {
    for (i = 0; i < array.length; i++) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}
