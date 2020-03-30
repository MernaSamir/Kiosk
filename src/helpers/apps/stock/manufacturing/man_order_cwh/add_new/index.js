export default {
    man_order: {
        layoutName: "",
        type: 'Layout_1',
        tabkeys: ['nw'],
        reduxName: 'stock__manufacture_orders',
        init: {
            key: 'List',
            select: {},
            then: {
                key: 'Filter',
                params: {
                    'is_draft': false,
                    'manufacture_date':null,
                },
            }
        },
        list: true,
        fields: [
            {
                type: 'Add_Table', name: "",
                reduxName: 'stock__manufacture_orders',
                push_url: '/manufacture_order_cwh/',
                table_columns: [
                    {
                        head: 'Number',
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