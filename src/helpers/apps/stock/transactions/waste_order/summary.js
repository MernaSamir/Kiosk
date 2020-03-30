const add_new = {
    name: "Summary Inter Store",
    path: '/waste-order-inter-summary',
    reduxName: 'stock__waste_order',
    fetch: ['licensing__store'],
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__waste_order',
            init: {
                key: 'List',
                select: {},
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__waste_order',
                    push_url: '/waste-order/',
                    doc: '/waste-order-doc/',
                    header_new_button: true,
                    add_new_item: false,
                    table_columns: [
                        {
                            head: 'Invoice Number',
                            type: "DisplayValue",
                            name: 'invoice',
                        },
                        {
                            head: ' Waste Date',
                            type: "DisplayValue",
                            name: 'waste_date',
                            timeStampe: true
                        },
                    ]
                },
            ]
        }
    ]
}

export default add_new;