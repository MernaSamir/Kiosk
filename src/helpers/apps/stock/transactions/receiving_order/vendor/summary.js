const add_new = {
    name: "Summary",
    path: '/receiving-order-inter-summary',
    reduxName: 'stock__transaction_ro',
    hide_actions: true,
    fetch: ['licensing__store', 'stock__transaction_tr', 'stock__product_requisition'],
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__transaction_ro',
            init: {
                key: 'Filter',
                params: {
                    'to_store': 'licensing__store.active',
                }
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__transaction',
                    push_url: '/receiving-order-inter-add/',
                    doc: '/receiving-order-inter-doc/',
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
                        {
                            head: 'Sender',
                            type: "display_redux",
                            name: 'from_store',
                            reduxName: 'licensing__store',
                        }, {
                            head: 'To',
                            type: "display_redux",
                            name: 'to',
                            reduxName: 'stock__transaction_tr',
                        },


                    ]
                },
            ]
        }
    ]
}

export default add_new;