const add_new = {
    name: "Summary",
    path: '/audit-summary',
    reduxName: 'stock__audits',
    fetch: ['licensing__store'],
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__audits',
            init: {
                key: 'List',
                select: {
                    store: 'licensing__store.active'
                },
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__audits',
                    push_url: '/audit/',
                    doc:"/audit_doc/",
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
                    ]
                },
            ]
        }
    ]
}

export default add_new;