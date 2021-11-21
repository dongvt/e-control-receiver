//capture buttons
const play = document.querySelector("#play");
const stop = document.querySelector("#stop");

//Content
const statusDiv = document.querySelector("#status");

//Includes addresses as working in root (not in controllers)
//This is because this file is linked on index.html which is in root
const Receiver = require("./model/Receiver");
const server = new Receiver(stop, play, statusDiv);
server.start();
