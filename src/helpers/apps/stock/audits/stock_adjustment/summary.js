const add_new = {
    name: "Summary Inter Store",
    path: '/stock-adjustment-summary',
    reduxName: 'stock__transaction',
    fetch: ['licensing__store'],
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
                        '_type': 'WO',
                    },
                    then: {
                        key: "Reject",
                        params: {
                            'from_store': null
                        }
                    }
                }
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__transaction',
                    push_url: '/waste-order/',
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
                        }
                    ]
                },
            ]
        }
    ]
}

export default add_new;