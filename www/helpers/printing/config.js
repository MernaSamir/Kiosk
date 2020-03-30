var printer =  require('node-thermal-printer')


export default () => {
    printer.init({
        type: 'epson',                                     // Printer type: 'star' or 'epson'
        characterSet: 'SLOVENIA',                         // Printer character set
        removeSpecialCharacters: false,                   // Removes special characters - default: false
        replaceSpecialCharacters: true,                   // Replaces special characters listed in config files - default: true
        interface: 'tcp://192.168.100.211:9100',         // Linux interface    
        // ip: "192.168.100.211",                // Ethernet printing IP
        // port: 9100                      // Ethernet printing PORT
    });
    return printer;

}