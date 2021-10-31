const {ipcRenderer} = require('electron');
const testButton = document.querySelector('#cursor');
testButton.addEventListener('click',(e)=> {
    e.preventDefault();
    //make a lot of send calls
    ipcRenderer.send('from-process','right');
})
