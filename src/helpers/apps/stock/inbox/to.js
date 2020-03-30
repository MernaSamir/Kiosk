export default {
    layoutName: "",
    type: 'Layout_1',
    tabkeys: ["to"],
    reduxName: 'stock__transaction_tr',
    init: {
        key: 'List',
        select: {},
        then: {
            key: 'Filter',
            params: {
                to_store: 'licensing__store.active'
            }
        }
    },
    list: true,
    fields: [
        {
            type: 'Add_Table', name: "",
            reduxName: 'stock__transaction_tr',
            push_url: '/transfer-order-doc/',
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
                    head: 'Sender',
                    type: "display_redux",
                    name: 'from_store',
                    reduxName: 'licensing__store',
                }
            ]
        },
    ]
}