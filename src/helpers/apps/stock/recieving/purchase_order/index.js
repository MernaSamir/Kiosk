export default {
    purchase_order: {
        layoutName: "",
        tabkeys: ['po'],
        type: 'Layout_1',
        // main: true,
        list: true,
        reduxName: 'stock__purchase_orders',
        init: {
            key: 'List',
            select: {},
            then: {
                key: 'Filter',
                params: {
                    'end': false,
                    // 'stores': 'licensing__store.active',
                },
            }
            // then: {
            //     key: 'picking',
            //     pick: 'licensing__store.active',
            //     select: 'stores',
            // }
        },
        fields: [
            {
                type: 'Add_Table', name: "",
                reduxName: 'stock__purchase_orders',
                push_url: '/purchase_order/',
                add_new_item: false,
                table_columns: [
                    {
                        head: 'Number',
                        type: "DisplayValue",
                        name: 'invoice',
                    },
                    {
                        head: 'Date',
                        type: "DisplayValue",
                        name: 'updated_at',
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
    },
}
