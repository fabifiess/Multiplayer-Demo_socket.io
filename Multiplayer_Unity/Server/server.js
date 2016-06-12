var io = require('socket.io')(process.env.PORT || 3000);
console.log('Server started');
// Server shall remember  the connected clients and give this information to new connected clients
var playerCount = 0;

io.on('connection', function (socket) {
    // Log whenever a new client connects
    console.log('Client connected, broadcasting spawn');

    // will be sent to all connected clients (io.emit is OK, too)
    socket.broadcast.emit('spawn');
    playerCount++;
    for (i = 0; i < playerCount; i++) {
        // the new player (only this one) will get information about the existing ones
        socket.emit("spawn");
        console.log("sending spawn to the new player");
    }

    // will only be sent to the newly connected client
    socket.on('move', function (data) {
        console.log("client moved");
    });

    // detects when the player is getting disconnected again
    socket.on('disconnect', function(){
        console.log("Client disconnected");
        playerCount--;
    })

});