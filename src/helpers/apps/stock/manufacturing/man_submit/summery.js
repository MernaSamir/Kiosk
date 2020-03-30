const man_summery = {
    name: "Summary",
    path: '/manufacture_submit_order_summary',
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
                        'is_draft': false,
                        '_type': "st",
                    },
                }
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__manufacture_orders',
                    push_url: '/manufacture_submit_order/',
                    doc: '/manufacture_submit_order_doc/',
                    doc_condition:{
                        key:"manufacture_date",
                        value: null,
                    },
                    header_new_button: true,
                    add_new_item: false,
                    table_columns: [
                        {
                            head: 'Invoice Number',
                            type: "DisplayValue",
                            name: 'invoice',
                        },
                        {
                            head: 'Order date',
                            type: "DisplayValue",
                            name: 'manufacture_order_date',
                            timeStampe: true
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