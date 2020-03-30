// import printerInit from './confi/g'
const printer = require('node-thermal-printer')
const moment = require('moment')
// const printer = require('printer');
// import moment from 'moment'
// import printer from 'node-thermal-printer'
module.exports = (bill, data, setting) => {
    // console.log(data)
    setting = Object.assign({
        logo: './logo.png',
        Location: 'Waleema',
        Mode: 'Dine In',
        Order: '#51',
        Invoice: '#51',
        Server: 'Ahmed',
        Station: '1',
        Date: moment().format('DD-MM-YYYY'),
        Time: moment().format('hh:mm')

    }, setting || {})
    printer.init({
        type: 'epson',                                     // Printer type: 'star' or 'epson'
        characterSet: 'SLOVENIA',                         // Printer character set
        removeSpecialCharacters: false,                   // Removes special characters - default: false
        replaceSpecialCharacters: true,                   // Replaces special characters listed in config files - default: true
        interface: 'tcp://192.168.100.211:9100',         // Linux interface
        // ip: "192.168.100.211",                // Ethernet printing IP
        // port: 9100                      // Ethernet printing PORT
    });
    printer.isPrinterConnected((response) => {
        // calcBillTotal(bill,discount, service.service_charge, tax.location_tax_value, (data)=>{
        // let mainData = data || {}
        // let subTotal = mainData.original;
        // let discountVal = mainData.discountValue;
        // let billService = mainData.serviceValue;
        // let billTax = mainData.taxValue;
        // let total = mainData.total
        // const billTax = (balanceDue+billService) * 20/100;
        // total = total+billTax+billService
        // total = total +service +tax;
        // console.log('priting start', response)
        printer.alignCenter();
        printer.printImage('./logo.png', function (done) {
            printer.table([`Location: ${setting.Location}`, `Mode: ${setting.Mode}`]);
            printer.table([`Order: ${setting.Order}`, `Invoice: ${setting.Invoice}`]);
            printer.table([`Server: ${setting.Server}`, `Station: ${setting.Station}`]);
            printer.table([`Date:${setting.Date}`, `Time: ${setting.Time}`]);
            // bill  Header
            printer.tableCustom([
                { text: "Q", width: 0.1, bold: true },
                { text: "Item", width: 0.35, bold: true },
                { text: "S", width: 0.1, },
                { text: "Each", width: 0.1, },
                { text: "Total", width: 0.3, bold: true, align: "CENTER" },
            ]);
            //Line
            printer.setTypeFontB();
            printer.drawLine();
            printer.setTextNormal();
            // bill content
            // console.log('here bill')

            (bill || []).map((d, index) => {
                printer.tableCustom([
                    { text: String(d.quantity), width: 0.1, bold: true },
                    { text: d.name, width: 0.35, bold: true },
                    { text: d.size.substring(0, 2), width: 0.05, },
                    { text: String(d.price), width: 0.2, },
                    { text: String(d.price * d.quantity), width: 0.2, bold: true },
                ]);
            })
            // line
            printer.setTypeFontB();
            printer.drawLine();
            printer.setTextNormal();
            printer.alignLeft();
            // calculations

            printer.tableCustom([
                { text: 'Subtotal', width: 0.6, bold: true, align: 'LEFT' },
                { text: String(data.original), width: 0.2, align: "RIGHT" },

            ])
            printer.tableCustom([
                { text: 'Discount', width: 0.6, bold: true, align: 'LEFT' },
                { text: String(data.discountValue), width: 0.2, align: "RIGHT" },

            ])
            printer.tableCustom([
                { text: `Service Charges ${data.service}%`, width: 0.6, bold: true, align: 'LEFT' },
                { text: String(data.serviceValue), width: 0.2, align: "RIGHT" },

            ])
            printer.tableCustom([
                { text: 'Tax', width: 0.6, bold: true, align: 'LEFT' },
                { text: String(data.taxValue), width: 0.2, align: "RIGHT" },

            ])
            printer.tableCustom([
                { text: 'Net Total', width: 0.6, bold: true, align: 'LEFT' },
                { text: String(data.total), width: 0.2, align: "RIGHT" },

            ])
            console.log('here finish')

            printer.alignCenter();
            printer.setTypeFontB();                             // Set font type to B
            printer.drawLine();
            printer.setTextNormal();
            printer.alignLeft();

            printer.tableCustom([
                { text: 'Cash', width: 0.6, bold: true, align: 'LEFT' },
                { text: String(data.total), width: 0.2, align: "RIGHT" },

            ])
            // console.log('here finish')

            printer.openCashDrawer();
            printer.cut();
            printer.execute();
        });
    })
}
