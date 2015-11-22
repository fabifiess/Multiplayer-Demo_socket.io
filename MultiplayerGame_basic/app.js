// 03: + Socket.io

// Benötigte Module laden
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var colorCollection = ["#db0031", "#ffff00", "#ff00ff", "#00ffff", "#00ff00", "#ff0000", "#0000ff"]
var clients = [];
var clientColors = [];
var posX = [];
var posY = [];


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
        clients.push(socket.id);
        var number = clients.length - 1;
        clientColors[number] = colorCollection[number];
        posX[number] = Math.floor((Math.random() * 1400) + 0);
        posY[number] = Math.floor((Math.random() * 900) + 0);


        console.log("number: " + number.toString());
        console.log("clients[0]: " + clients[number]);
        console.log("clientColors[0]: " + clientColors[number]);
        console.log("posX[0]: " + posX[number]);
        console.log("posY[0]: " + posY[number]);


        var newPlayer = {
            number: number,
            color: clientColors,
            posX: posX,
            posY: posY
        };

        console.log("newPlayer.number: " + newPlayer.number);
        console.log("newPlayer.color: " + newPlayer.color);
        console.log("newPlayer.posX: " + newPlayer.posX);
        console.log("newPlayer.posY: " + newPlayer.posY);



        io.emit("createNewPlayer", newPlayer);
    }


    socket.on('chat message', function (msg) {
        //console.log('message: ' + msg + " " + socket.id);
        //clients.push(socket.id);
        //console.log(clients);
        //if (contains(clients, socket.id)) {
        //    console.log("stimmt");
        //}



        io.emit('chat message', msg);
    });
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
