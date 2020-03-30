const add_new = {
    name: "Summary",
    path: '/product-requisition-inter-summary',
    reduxName: 'stock__product_requisition',
    fetch: ['licensing__store'],
    hide_actions: true,
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__product_requisition',
            init: {
                key: 'List',
                select: {},
                then: {
                    key: 'Filter',
                    params: {
                        '_type': 'CWH',
                        to_store: 'licensing__store.active'
                    }
                }
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__product_requisition',
                    push_url: '/product-requisition-inter-add/',
                    doc:'/product-requisition-inter-doc/',
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
                            head: 'Requested From',
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