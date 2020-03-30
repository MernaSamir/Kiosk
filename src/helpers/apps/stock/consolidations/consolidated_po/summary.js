const add_new = {
    name: "Summary Inter Store",
    path: '/consolidated_po_summary',
    reduxName: 'stock__consolidations',
    //fetch: ['licensing__store'],
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__consolidations',
            init: {
                key: 'List',
                select: {},
                then: {
                    key: 'Filter',
                    params: {
                        'is_cto': true,
                        'cto_closed': null,
                    },
                }
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__consolidations',
                    push_url: '/consolidated_po/',
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