export default {
    transfer_order: {
        layoutName: "",
        tabkeys: ['to'],
        type: 'Layout_1',
        // main: true,
        list: true,
        reduxName: 'stock__transaction_tr',
        init: {
            key: 'List',
            select: {},
            then: {
                key: 'Filter',
                params: {
                    'end': false,
                    'to_store': 'licensing__store.active',
                },
            }
        },
        fields: [
            {
                type: 'Add_Table', name: "",
                reduxName: 'stock__transaction_tr',
                push_url: '/transfer_order/',
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