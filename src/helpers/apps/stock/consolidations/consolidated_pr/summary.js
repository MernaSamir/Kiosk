const add_new = {
    name: "Summary Inter Store",
    path: '/consolidated_pr_summary',
    reduxName: 'stock__consolidations',
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__consolidations',
            init: {
                key: 'List',
                select: {}
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__consolidations',
                    push_url: '/consolidated_pr/',
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
                    ]
                },
            ]
        }
    ]
}

export default add_new;