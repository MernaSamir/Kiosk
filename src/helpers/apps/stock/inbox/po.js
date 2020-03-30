export default {
    layoutName: "",
    type: 'Layout_1',
    tabkeys: ["po"],
    reduxName: 'stock__purchase_orders',
    init: {
        key: 'DataIncludes',
        select: 'stores',
        pick: 'licensing__store.active'
        
    },
    list: true,
    fields: [
        {
            type: 'Add_Table', name: "",
            reduxName: 'stock__purchase_orders',
            push_url: '/consolidated_po_doc/',
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
                    head: 'Vendor',
                    type: "display_redux",
                    name: 'vendor',
                    reduxName: 'parties__vendor',
                }
            ]
        },
    ]
}