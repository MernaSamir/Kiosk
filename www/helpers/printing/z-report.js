const printer = require('node-thermal-printer')
module.exports = (setting , Menus) => {
    setting = setting || {
        Location: 'Waleema',
        businessDay: moment().format('DD-MM-YYYY hh:mm'),
        startDate: '2/2/2002',
        endDate: '12/2/2002',
        fristOrderDate: moment().format('DD-MM-YYYY hh:mm'),
        lastOrderDate: moment().format('DD-MM-YYYY hh:mm'),
        count: 1,
        currency: 'EGP',
        itemSales: '12.345',
        voids: '12.345',
        discounts: '12.345',
        netSales: '12.345',
        charges: '12.345',
        taxes: '12.345',
        rounding: '12.345',
        grossSales: '12.345',
        cash: '4444',
        credit: '111',
        netSalesTW: '11',
        grossSalesTW: '13',
        netSalesDI: '55',
        grossSalesDI: '44'
    }
    printer.init({
        type: 'epson',                                     // Printer type: 'star' or 'epson'
        characterSet: 'SLOVENIA',                         // Printer character set
        removeSpecialCharacters: false,                   // Removes special characters - default: false
        replaceSpecialCharacters: false,
        extraSpecialCharacters: { '£': 163 },                // Adds additional special characters to those listed in the config files
        // Replaces special characters listed in config files - default: true
        interface: 'tcp://192.168.100.211:9100',         // Linux interface    
        // ip: "192.168.100.211",                // Ethernet printing IP
        // port: 9100                      // Ethernet printing PORT
    }),

        printer.isPrinterConnected((response) => {

            printer.alignCenter();
            printer.setTextQuadArea();

            printer.println("Z Report");
            printer.alignLeft();
            printer.setTextNormal();                            // Set text to normal
            printer.newLine();                                  // Insers break line
            printer.tableCustom([
                { text: 'Location', width: 0.4, align: 'LEFT' },
                { text: location, width: 0.6, align: "LEFT" },

            ])
            printer.tableCustom([
                { text: 'Bussiness Days', width: 0.4, align: 'LEFT' },
                { text: businessDay, width: 0.6, align: "LEFT" },
            ])
            printer.tableCustom([
                { text: '', width: 0.4, align: 'LEFT' },
                { text: `Started ${startDate}`, width: 0.7, align: "LEFT" },

            ])
            printer.tableCustom([
                { text: '', width: 0.4, align: 'LEFT' },
                { text: `Ended at ${endDate} `, width: 0.7, align: "LEFT" },
            ])
            printer.tableCustom([
                { text: 'First Order', width: 0.4, align: 'LEFT' },
                { text: fristOrderDate, width: 0.7, align: "LEFT" },
            ])
            printer.tableCustom([
                { text: 'Last Order', width: 0.4, align: 'LEFT' },
                { text: lastOrderDate, width: 0.7, align: "LEFT" },
            ])
            printer.tableCustom([
                { text: 'Receipt', width: 0.4, align: 'LEFT' },
                { text: count, width: 0.8, align: "LEFT" },
            ])
            printer.tableCustom([
                { text: 'Currency', width: 0.4, align: 'LEFT' },
                { text: currency, width: 0.8, align: "LEFT" },
            ])
            printer.newLine();
            printer.setTypeFontB();                             // Set font type to B
            printer.drawLine();
            printer.setTextNormal(); printer.tableCustom([
                { text: 'Item Sales', width: 0.65, align: 'LEFT' },
                { text: itemSales, width: 0.4, align: "LEFT" },
            ])
            printer.tableCustom([
                { text: `(Voids)(${voids}) `, width: 0.45, align: 'RIGHT' },
                { text: '', width: 0.4, align: "LEFT" },
            ])
            printer.tableCustom([
                { text: `(Discounts) (${discounts})`, width: 0.45, align: 'RIGHT' },
                { text: '', width: 0.4, align: "LEFT" },
            ])
            printer.newLine();
            printer.tableCustom([
                { text: 'Net Sales', width: 0.65, align: 'LEFT' },
                { text: netSales, width: 0.4, align: "LEFT" },
            ])
            printer.tableCustom([
                { text: `Charges ${charges}`, width: 0.45, align: 'RIGHT' },
                { text: '', width: 0.4, align: "LEFT" },
            ])
            printer.tableCustom([
                { text: `Taxes ${taxes}`, width: 0.45, align: 'RIGHT' },
                { text: '', width: 0.4, align: "LEFT" },
            ])
            printer.tableCustom([
                { text: `Rounding ${rounding}`, width: 0.45, align: 'RIGHT' },
                { text: '', width: 0.4, align: "LEFT" },
            ])
            printer.newLine();
            printer.tableCustom([
                { text: 'Gross Sales', width: 0.65, align: 'LEFT' },
                { text: grossSales, width: 0.4, align: "LEFT" },
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
                { text: cash, width: 0.6, align: "LEFT" },
            ])
            printer.tableCustom([
                { text: 'Credit Card', width: 0.4, align: 'LEFT' },
                { text: credit, width: 0.6, align: "LEFT" },
            ])
            printer.setTypeFontB();                             // Set font type to B
            printer.drawLine();
            printer.setTextNormal();
            printer.tableCustom([
                { text: 'Order Modes', width: 0.65, align: 'LEFT', bold: 'True' },
                { text: modes, width: 0.4, align: "LEFT" },
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
                { text: netSalesTW, width: 0.3, align: "LEFT" },
                { text: grossSalesTW, width: 0.3, align: "LEFT" },
            ])
            printer.tableCustom([
                { text: 'Dine In', width: 0.3, align: 'LEFT', },
                { text: '#', width: 0.3, align: "LEFT" },
                { text: netSalesDI, width: 0.3, align: "LEFT" },
                { text: grossSalesDI, width: 0.3, align: "LEFT" },
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
            (Menus || []).map((menu, index) => {
                printer.tableCustom([
                    { text: menu.name, width: 0.3, align: "LEFT" },
                    { text: menu.totalOrder, width: 0.3, align: "LEFT" },
                ]);
            })
          
            printer.newLine();
            printer.openCashDrawer();
            printer.cut();
            printer.execute();
        });

    }
