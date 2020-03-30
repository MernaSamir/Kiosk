const add_new = {
    name: "Summary",
    path: '/stock-count-summary',
    reduxName: 'stock__stock_count',
    fetch: ['licensing__store'],
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__stock_count',
            init: {
                key: 'List',
                select: {
                    store: 'licensing__store.active'
                },
                then: {
                    key: 'Filter',
                    params: {
                        '_type': 'st',
                    },
                }
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__stock_count',
                    push_url: '/stock-count/',
                    doc:'/stock-count_doc/',
                    header_new_button: true,
                    add_new_item: false,
                    table_columns: [
                        {
                            head: 'Invoice Number',
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
                            head: 'Store',
                            type: "display_redux",
                            name: 'store',
                            reduxName: 'licensing__store',
                        }
                    ]
                },
            ]
        }
    ]
}

export default add_new;