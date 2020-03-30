import printer from './config'

// var printer = require('node-thermal-printer')
// printer.init({
//     type: 'epson',                                     // Printer type: 'star' or 'epson'
//     characterSet: 'SLOVENIA',                         // Printer character set
//     removeSpecialCharacters: false,                   // Removes special characters - default: false
//     replaceSpecialCharacters: false,
//     extraSpecialCharacters: { '£': 163 },                // Adds additional special characters to those listed in the config files
//     // Replaces special characters listed in config files - default: true
//     interface: 'tcp://192.168.100.211:9100',         // Linux interface    
//     ip: "192.168.100.211",                // Ethernet printing IP
//     port: 9100                      // Ethernet printing PORT
// }),

    printer.isPrinterConnected(function (response) {
        // console.log("Printer connected:", response);
        printer.alignCenter();
        printer.setTextQuadArea();

        printer.println("Z Report");
        printer.alignLeft();
        printer.setTextNormal();                            // Set text to normal
        printer.newLine();                                  // Insers break line
        printer.tableCustom([
            { text: 'Location', width: 0.4, align: 'LEFT' },
            { text: 'ABC', width: 0.6, align: "LEFT" },

        ])
        printer.tableCustom([
            { text: 'Bussiness Days', width: 0.4, align: 'LEFT' },
            { text: 'dd/mm/yyyy', width: 0.6, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: '', width: 0.4, align: 'LEFT' },
            { text: 'Started at dd/mm/yyyy', width: 0.7, align: "LEFT" },

        ])
        printer.tableCustom([
            { text: '', width: 0.4, align: 'LEFT' },
            { text: 'Ended at dd/mm/yyyy', width: 0.7, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: 'First Order', width: 0.4, align: 'LEFT' },
            { text: 'dd/mm/yyyy hh:mm:ss', width: 0.7, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: 'Last Order', width: 0.4, align: 'LEFT' },
            { text: 'dd/mm/yyyy hh:mm:ss', width: 0.7, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: 'Receipt', width: 0.4, align: 'LEFT' },
            { text: 'Count#(From #1 To #10)', width: 0.8, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: 'Currency', width: 0.4, align: 'LEFT' },
            { text: 'EGP', width: 0.8, align: "LEFT" },
        ])
        printer.newLine();
        printer.setTypeFontB();                             // Set font type to B
        printer.drawLine();
        printer.setTextNormal(); printer.tableCustom([
            { text: 'Item Sales', width: 0.65, align: 'LEFT' },
            { text: '12.345', width: 0.4, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: "(Voids) (12.345)", width: 0.45, align: 'RIGHT' },
            { text: '', width: 0.4, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: "(Discounts) (12.345)", width: 0.45, align: 'RIGHT' },
            { text: '', width: 0.4, align: "LEFT" },
        ])
        printer.newLine();
        printer.tableCustom([
            { text: 'Net Sales', width: 0.65, align: 'LEFT' },
            { text: '12.345', width: 0.4, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: 'Charges 12.345', width: 0.45, align: 'RIGHT' },
            { text: '', width: 0.4, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: 'Taxes 12.345', width: 0.45, align: 'RIGHT' },
            { text: '', width: 0.4, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: 'Rounding 12.345', width: 0.45, align: 'RIGHT' },
            { text: '', width: 0.4, align: "LEFT" },
        ])
        printer.newLine();
        printer.tableCustom([
            { text: 'Gross Sales', width: 0.65, align: 'LEFT' },
            { text: '12.345', width: 0.4, align: "LEFT" },
        ])
        printer.newLine();
        printer.setTypeFontB();                             // Set font type to B
        printer.drawLine();
        printer.setTextNormal(); printer.tableCustom([
            { text: 'Payment Details', width: 0.65, align: 'LEFT', bold: 'True' },
            { text: '', width: 0.4, align: "LEFT" },
        ])
        printer.setTextNormal();                            // Set text to normal
        printer.tableCustom([
            { text: 'Cash', width: 0.4, align: 'LEFT' },
            { text: '12.345', width: 0.6, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: 'Credit Card', width: 0.4, align: 'LEFT' },
            { text: '12.345', width: 0.6, align: "LEFT" },
        ])
        printer.setTypeFontB();                             // Set font type to B
        printer.drawLine();
        printer.setTextNormal();
        printer.tableCustom([
            { text: 'Order Modes', width: 0.65, align: 'LEFT', bold: 'True' },
            { text: '', width: 0.4, align: "LEFT" },
        ])
        printer.setTypeFontB();                             // Set font type to B
        printer.tableCustom([
            { text: '', width: 0.3, align: 'LEFT', },
            { text: 'Receipts', width: 0.3, align: "LEFT" },
            { text: 'Net Sales', width: 0.3, align: "LEFT" },
            { text: 'Gross Sales', width: 0.3, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: 'Takeaway', width: 0.3, align: 'LEFT', },
            { text: '#', width: 0.3, align: "LEFT" },
            { text: '12.345', width: 0.3, align: "LEFT" },
            { text: '12.345', width: 0.3, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: 'Dine In', width: 0.3, align: 'LEFT', },
            { text: '#', width: 0.3, align: "LEFT" },
            { text: '12.345', width: 0.3, align: "LEFT" },
            { text: '12.345', width: 0.3, align: "LEFT" },
        ])
        printer.setTypeFontB();                             // Set font type to B
        printer.drawLine();
        printer.setTextNormal();                            // Set text to normal


        printer.tableCustom([
            { text: 'Menus', width: 0.65, align: 'LEFT', bold: 'True' },
            { text: '', width: 0.4, align: "LEFT" },
        ])

        printer.setTextNormal();                            // Set text to normal
        printer.alignCenter();
        printer.println("Net Sales")
        printer.alignLeft();
        printer.tableCustom([
            { text: 'Menu One', width: 0.3, align: "LEFT" },
            { text: '12.345', width: 0.3, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: 'Menu Two', width: 0.3, align: "LEFT" },
            { text: '12.345', width: 0.3, align: "LEFT" },
        ])
        printer.tableCustom([
            { text: 'Menu Three', width: 0.3, align: "LEFT" },
            { text: '12.345', width: 0.3, align: "LEFT" },
        ])
        printer.newLine();
        printer.openCashDrawer();
        printer.cut();
        printer.execute();
    });


