export default {
    sum: {
        layoutName: "",
        tabkeys: ['summary'],
        type: 'Layout_1',
        // main: true,
        list: true,
        reduxName: 'stock__transaction_ro',
        init: {
            key: 'List',
            select: {},
            then: {
                key: 'Filter',
                params: {
                    'to_store': 'licensing__store.active',
                },
            }
        },
        fields: [
            {
                type: 'Add_Table', name: "",
                reduxName: 'stock__transaction_ro',
                push_url: '/recieving_order_draft/',
                doc:'/recieving_order/',
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
                        head: 'Type',
                        type: "DisplayValue",
                        name: '_type',
                        options: [
                            { key: 'TO', value: "cwh" },
                            { key: 'PO', value: "v" },
                            { key: 'O', value: "o" }
                        ]
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