const add_new = {
    name: "Summary Vendors",
    path: '/product-requisition-vendor-summary',
    reduxName: 'stock__product_requisition',
    fetch: ['licensing__store', 'parties__vendor'],
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
                        '_type': 'V',
                    }
                }
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__product_requisition',
                    push_url: '/product-requisition-vendor-add/',
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