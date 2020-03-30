const man_summery = {
    name: "Summary",
    path: '/manufacture',
    reduxName: 'stock__manufacture_orders',
    layouts: [
        {
            layoutName: "",
        type: 'Layout_1',
        reduxName: 'stock__manufacture_orders',
        init: {
            key: 'List',
            select: {},
            then: {
                key: 'Filter',
                params: {
                    'end': true,
                    'from_store':"licensing__store.active"
                },
            }
        },
        list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__manufacture_orders',
                    push_url: '/manufacture_order/',
                    doc:"/manufacture_order_doc/",
                    header_new_button: true,
                    table_columns: [
                        {
                            head: 'Number',
                            type: "DisplayValue",
                            name: 'mo_invoice',
                        },
                        {
                            head: 'Manufacture date',
                            type: "DisplayValue",
                            name: 'manufacture_date',
                            timeStampe: true
                        },
                        {
                            head: 'Status',
                            type: "DisplayValue",
                            name: 'is_draft',
                            options: [
                                { key: 'Draft', value: true },
                                { key: 'Submitted', value: false }
                            ]
                        },
                    ]
                },
            ]
        }
    ]
}

export default man_summery;
