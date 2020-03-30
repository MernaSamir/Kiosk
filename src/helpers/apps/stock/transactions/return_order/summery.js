const man_summery = {
    name: "Summary",
    path: '/return-order-inter-summary',
    reduxName: 'stock__return_order',
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__return_order',
            init: {
                key: 'List',
                select: {},
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__return_order',
                    push_url: '/return-order/',
                    doc: '/return-order-doc/',
                    header_new_button: true,
                    add_new_item: false,
                    table_columns: [
                        {
                            head: 'Invoice Number',
                            type: "DisplayValue",
                            name: 'invoice',
                        },
                        {
                            head: 'return date',
                            type: "DisplayValue",
                            name: 'return_date',
                            timeStampe: true
                        },

                    ]
                },
            ]
        }
    ]
}

export default man_summery;