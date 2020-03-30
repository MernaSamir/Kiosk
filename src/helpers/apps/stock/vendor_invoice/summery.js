const man_summery = {
    name: "Summary",
    path: '/vendor-invoice-summary',
    reduxName: 'stock__vendor_invoices',
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__vendor_invoices',
            init: {
                key: 'List',
                select: {},
                then: {
                    key: 'Filter',
                    params: {
                        'is_draft': false,
                    },
                }
            },
            list: true,
            fields: [
                {
                    type: 'Add_Table', name: "",
                    reduxName: 'stock__vendor_invoices',
                    push_url: '/vendor-invoice/',
                    doc: '/vendor-invoice-doc/',
                    header_new_button: true,
                    add_new_item: false,
                    table_columns: [
                        {
                            head: 'Invoice Number',
                            type: "DisplayValue",
                            name: 'invoice',
                        },
                        {
                            head: 'Vendor invoice',
                            type: "DisplayValue",
                            name: 'vendor_invoice',
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

export default man_summery;