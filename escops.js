const escpos = require('escpos');
 
// Select the adapter based on your printer type
// const device  = new escpos.USB();
const device  = new escpos.Network('192.168.100.211');
// const device  = new escpos.Serial('/dev/usb/lp0');
 
const options = { encoding: "GB18030" /* default */ }
// encoding is optional
 
const printer = new escpos.Printer(device, options);
 
 
 
device.open(function(){
  printer
  .font('a')
  .align('ct')
  .style('bu')
  .size(1, 1)
  .text('The quick brown fox jumps over the lazy dog')
  .barcode('1234567', 'EAN8')
  .qrimage('https://github.com/song940/node-escpos', function(err){
    this.cut();
    this.close();
  });
});