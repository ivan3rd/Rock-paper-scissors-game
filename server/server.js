const http =require('http');
const express = require('express');
const socketio = require('socket.io');

const RpsGame = require('./rps-game-logic');


const app = express();
const clientPath = `${__dirname}/../client`;
console.log(`Serve static files in ${clientPath}`);
app.use(express.static(clientPath))

const server = http.createServer(app);

const io= socketio(server);

let waitingplayer = null;

io.on('connection',(sock)=>{
    if(waitingplayer){
        //start the game
        //[sock, waitingplayer].forEach(s=>s.emit('message', "Game starts"));
        new RpsGame(sock,waitingplayer);
        waitingplayer=null;
    }else{
        waitingplayer=sock;
        waitingplayer.emit('message', 'Waiting for an opponent')
    };
    
    //sock.emit('message','Hi, you are connected');

    sock.on('message', (text)=>{
        io.emit('message', text);
    });
})

server.on('error', (err)=>{
    console.error(`Server error:\n`,err);
});

server.listen(8080, ()=>{
    console.log('RPS started on 8080');
})