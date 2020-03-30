const add_new = {
    name: "Summary Inter Store",
    path: '/purchase-order-inter-summary',
    reduxName: 'stock__transaction_tr',
    fetch: ['licensing__store'],
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__transaction_tr',
            init: {
                key: 'List',
                select: {},
                then: {
                    key: 'Filter',
                    params: {
                        'ro_date': null,
                        'is_po':true,
                    },
                }
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__transaction',
                    push_url: '/purchase-order-inter-add/',
                    header_new_button: true,
                    add_new_item: false,
                    table_columns: [
                        {
                            head: 'Document',
                            type: "DisplayValue",
                            name: 'invoice',
                        },
                        {
                            head: 'Date',
                            type: "DisplayValue",
                            name: 'created_at',
                            timeStampe: true
                        },
                        {
                            head: 'To Store',
                            type: "display_redux",
                            name: 'to_store',
                            reduxName: 'licensing__store',
                        },
                        {
                            head: 'From Store',
                            type: "display_redux",
                            name: 'from_store',
                            reduxName: 'licensing__store',
                        },

                    ]
                },
            ]
        }
    ]
}

export default add_new;