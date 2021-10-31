//capture buttons
const play = document.querySelector('#play');
const stop = document.querySelector('#stop');

//Includes address as working in root (not controllers)
//This is because this file is linked on index.html which is in root
const Receiver = require('./model/Receiver');
const server = new Receiver(stop,play);
server.start();

//ipc test



