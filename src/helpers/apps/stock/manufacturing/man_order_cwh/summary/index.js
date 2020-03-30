export default {
    man_order_summary: {
        layoutName: "",
        type: 'Layout_1',
        tabkeys: ['summary'],
        reduxName: 'stock__manufacture_orders',
        init: {
            key: 'List',
            select: {},
            then: {
                key: 'Filter',
                params: {
                    'is_draft': false,
                    'end':true,
                },
            }
        },
        list: true,
        fields: [
            {
                type: 'Add_Table', name: "",
                reduxName: 'stock__manufacture_orders',
                push_url: '/manufacture_order_cwh_doc/',
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
}