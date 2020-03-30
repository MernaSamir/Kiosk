const add_new = {
    name: "Summary Vendors",
    path: '/return-order-vendor-summary',
    reduxName: 'stock__transaction',
    fetch: ['licensing__store', 'parties__vendor'],
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__transaction',
            init: {
                key: 'List',
                select: {},
                then: {
                    key: 'Filter',
                    params: {
                        '_type': 'ReO',
                    },
                    then: {
                        key: "Reject",
                        params: {
                            'from_vendor': null
                        }
                    }
                }
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__transaction',
                    push_url: '/return-order-vendor-add/',
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
                            head: 'From Vendor',
                            type: "display_redux",
                            name: 'from_vendor',
                            reduxName: 'parties__vendor',
                        }
                    ]
                },
            ]
        }
    ]
}

export default add_new;