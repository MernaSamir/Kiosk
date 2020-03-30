var printer = require('node-thermal-printer')

//   printer.init({
//     type: 'star',
//     interface: 'tcp://192.168.100.211:9100',
//     printer:'auto',    // characterSet: 'LATINA',
//     removeSpecialCharacters: false,
//     replaceSpecialCharacters: true,
//   });
const rows = [{ qty: 1, item: "Soap", size: 'R', each: "10.00", total: "10.00" },
{ qty: 1, item: "Soap", size: 'R', each: "10.00", total: "10.00" },
{ qty: 1, item: "Soap", size: 'R', each: "10.00", total: "10.00" },
{ qty: 1, item: "Soap", size: 'R', each: "10.00", total: "10.00" },
{ qty: 1, item: "Soap", size: 'R', each: "10.00", total: "10.00" }
]


printer.init({
    type: 'epson',                                     // Printer type: 'star' or 'epson'
    characterSet: 'SLOVENIA',                         // Printer character set
    removeSpecialCharacters: false,                   // Removes special characters - default: false
    replaceSpecialCharacters: true,                   // Replaces special characters listed in config files - default: true
    interface: 'tcp://192.168.100.211:9100',         // Linux interface
    // ip: "192.168.100.211",                // Ethernet printing IP
    // port: 9100                      // Ethernet printing PORT
});

printer.isPrinterConnected(function (response) {
    // console.log("Printer connected:", response);
    printer.alignCenter();
    printer.printImage('./logo.png', function (done) {
        // console.log("Printer image:", done);

        // printer.leftRight("Left", "Right");                 // Prints text left and right
        printer.table(["Location: Waleema", "Mode:Dine In "]);
        printer.table(["Order: #51", "Invoice: #51"]);
        printer.table(["Server: Ahmed", "Station: 1"]);
        printer.table(["Date: 02/10/2018", "Time: 10:49AM"]);

        printer.tableCustom([                               // Prints table with custom settings (text, align, width, bold)
            { text: "Q", width: 0.1, bold: true },
            { text: "Item", width: 0.35, bold: true },
            { text: "S", width: 0.05, },
            { text: "Each", width: 0.1, },
            { text: "Total", width: 0.3, bold: true, align:"CENTER" },
        ]);
        printer.setTypeFontB();                             // Set font type to B
        printer.drawLine();
        printer.setTextNormal();
                (rows || []).map((d, index) => {
            printer.tableCustom([
                { text: d.qty, width: 0.1, bold: true },
                { text: d.item, width: 0.35, bold: true },
                { text: d.size, width: 0.05, },
                { text: d.each, width: 0.2, },
                { text: d.total, width: 0.2, bold: true },
            ]);
        })
        printer.setTypeFontB();                             // Set font type to B
        printer.drawLine();
        printer.setTextNormal();
                printer.alignLeft();
        printer.tableCustom([
            { text: 'Subtotal', width: 0.6, bold: true, align: 'LEFT' },
            { text: '222.00', width: 0.2, align: "RIGHT" },

        ])
        printer.tableCustom([
            { text: 'Discount', width: 0.6, bold: true, align: 'LEFT' },
            { text: '22.00', width: 0.2, align: "RIGHT" },

        ])
        printer.tableCustom([
            { text: 'Service Charges 12%', width: 0.6, bold: true, align: 'LEFT' },
            { text: '20.00', width: 0.2, align: "RIGHT" },

        ])
        printer.tableCustom([
            { text: 'Tax', width: 0.6, bold: true, align: 'LEFT' },
            { text: '2.00', width: 0.2, align: "RIGHT" },

        ])
        printer.tableCustom([
            { text: 'Net Total', width: 0.6, bold: true, align: 'LEFT' },
            { text: '300.00', width: 0.2, align: "RIGHT" },

        ])
        printer.alignCenter();
        printer.setTypeFontB();                             // Set font type to B
        printer.drawLine();
        printer.setTextNormal();
        printer.alignLeft();

                printer.tableCustom([
            { text: 'Cash', width: 0.6, bold: true, align: 'LEFT' },
            { text: '2.00', width: 0.2, align: "RIGHT" },

        ])

        printer.tableCustom([
            { text: 'Credit Card', width: 0.6, bold: true, align: 'LEFT' },
            { text: '10.00', width: 0.2, align: "RIGHT" },

        ])
        // ])
        // printer.tableCustom([
        //     {text:'Subtotal', width:0.4, bold:true},
        //     {text:'Discount', width:0.4, bold:true},
        //     {text:'Service Charges 12%', width:0.4, bold:true},
        //     {text:'Tax', width:0.4, bold:true},




        // ])


        // Prints table equaly
        // printer.tableCustom([                               // Prints table with custom settings (text, align, width, bold)
        //   { text:"Left", align:"LEFT", width:0.5 },
        //   { text:"Center", align:"CENTER", width:0.25, bold:true },
        //   { text:"Right", align:"RIGHT", width:0.25 }
        // ]);
        //   printer.beep();
        //   printer.alignLeft();
        //   printer.newLine();
        //   printer.println("Hello World!");
        //   printer.drawLine();

        //   printer.upsideDown(true);
        //   printer.println("Hello World upside down!");
        //   printer.upsideDown(false);
        //   printer.drawLine();

        //   printer.invert(true);
        //   printer.println("Hello World inverted!");
        //   printer.invert(false);
        //   printer.drawLine();

        //   printer.println("Special characters: ČčŠšŽžĐđĆćßẞöÖÄäüÜé");
        //   printer.drawLine();

        //   printer.setTypeFontB();
        //   printer.println("Type font B");
        //   printer.setTypeFontA();
        //   printer.println("Type font A");
        //   printer.drawLine();

        //   printer.alignLeft();
        //   printer.println("This text is on the left");
        //   printer.alignCenter();
        //   printer.println("This text is in the middle");
        //   printer.alignRight();
        //   printer.println("This text is on the right");
        //   printer.alignLeft();
        //   printer.drawLine();

        //   printer.setTextDoubleHeight();
        //   printer.println("This is double height");
        //   printer.setTextDoubleWidth();
        //   printer.println("This is double width");
        //   printer.setTextQuadArea();
        //   printer.println("This is quad");
        //   printer.setTextNormal();
        //   printer.println("This is normal");
        //   printer.drawLine();

        //   // printer.printBarcode("4126570807191");
        //   // printer.code128("4126570807191", {
        //   //   height: 50,
        //   //   text: 1
        //   // });

        //   // printer.printQR("https://olaii.com");

        //   printer.newLine();

        //   printer.leftRight("Left", "Right");

        //   printer.table(["One", "Two", "Three", "Four"]);

        //   printer.tableCustom([
        //     { text:"Left", align:"LEFT", width:0.5 },
        //     { text:"Center", align:"CENTER", width:0.25, bold:true },
        //     { text:"Right", align:"RIGHT", width:0.25 }
        //   ]);


        //   printer.cut();
        printer.openCashDrawer();
        printer.cut();
        printer.execute();
    });


});
