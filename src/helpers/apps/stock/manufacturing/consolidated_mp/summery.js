const man_summery = {
    name: "Summary",
    path: '/consolidated_manufacture_plan_summary',
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
                        '_type': "cwh",
                    },
                }
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__manufacture_orders',
                    push_url: '/consolidated_manufacture_plan/',
                    doc: '/consolidated_manufacture_plan_doc/',
                    header_new_button: true,
                    add_new_item: false,
                    table_columns: [
                        {
                            head: 'Document Number',
                            type: "DisplayValue",
                            name: 'invoice',
                        },
                        {
                            head: 'Manufacture date',
                            type: "DisplayValue",
                            name: 'manufacture_order_date',
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