const man_summery = {
    name: "Summary",
    path: '/butcher_order_summary',
    reduxName: 'stock__butcher_orders',
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__butcher_orders',
            init: {
                key: 'List',
                select: {},
                then: {
                    key: 'Filter',
                    params: {
                        is_plan: false
                    },
                }
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__butcher_orders',
                    push_url: '/butcher_order/',
                    doc: '/butcher_order_doc/',
                    header_new_button: true,
                    add_new_item: false,
                    table_columns: [
                        {
                            head: 'Document Number',
                            type: "DisplayValue",
                            name: 'invoice',
                        },
                        {
                            head: 'Date',
                            type: "DisplayValue",
                            name: 'date',
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