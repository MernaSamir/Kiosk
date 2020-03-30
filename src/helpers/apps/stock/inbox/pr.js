export default {
    layoutName: "",
    type: 'Layout_1',
    tabkeys: ["pr"],
    reduxName: 'stock__product_requisition',
    init: {
        key: 'List',
        select: {},
        then: {
            key: 'Filter',
            params: {
                from_store: 'licensing__store.active'
            }
        }
    },
    list: true,
    fields: [
        {
            type: 'Add_Table', name: "",
            reduxName: 'stock__product_requisition',
            push_url: '/product-requisition-inter-doc/',
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
                    head: 'Requester',
                    type: "display_redux",
                    name: 'to_store',
                    reduxName: 'licensing__store',
                }
            ]
        },
    ]
}