export default {
    form: {
        layoutName: "",
        tabkeys: ['summary'],
        type: 'Layout_1',
        // main: true,
        list: true,
        reduxName: 'stock__consolidations',
        init: {
            key: 'List',
            select: {},
            then: {
                key: 'Filter',
                params: {
                    '_type': 'cwh',
                },
            }
        },
        fields: [
            {
                type: 'Add_Table', name: "",
                reduxName: 'stock__consolidations',
                push_url: '/consolidated_to_summary/',
                add_new_item: false,
                table_columns: [
                    {
                        head: 'Number',
                        type: "DisplayValue",
                        name: 'cto_code',
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
    },
}