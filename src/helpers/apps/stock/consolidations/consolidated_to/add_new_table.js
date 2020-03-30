export default {
    main: {
        layoutName: "",
        tabkeys: ['cto'],
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
                    'cto_closed':null,
                    'is_draft': false,
                },
            }
        },
        fields: [
            {
                type: 'Add_Table', name: "",
                reduxName: 'stock__consolidations',
                push_url: '/consolidated_to_add/',
                add_new_item: false,
                table_columns: [
                    {
                        head: 'Number',
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
    },
}