module.exports = function(){
    // console.log(window);
    var ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.on('store-data', function (event,printing) {
        window.printing = printing;
    });
}