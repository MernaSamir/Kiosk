const add_new = {
    name: "Summary",
    path: '/transfer-order-inter-summary',
    reduxName: 'stock__transaction_tr',
    hide_actions: true,
    fetch: ['licensing__store', 'stock__product_requisition'],
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__transaction_tr',
            init: {
                key: 'Filter',
                params: {
                    'from_store': 'licensing__store.active',
                }
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__transaction',
                    push_url: '/transfer-order-inter-add/',
                    doc: '/transfer-order-inter-doc/',
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
                            head: 'Requester',
                            type: "display_redux",
                            name: 'to_store',
                            reduxName: 'licensing__store',
                        }, {
                            head: 'Pr',
                            type: "display_redux",
                            name: 'pr',
                            reduxName: 'stock__product_requisition',
                        },


                    ]
                },
            ]
        }
    ]
}

export default add_new;