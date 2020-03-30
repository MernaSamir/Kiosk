import FieldsBuild from 'helpers/fields'

const add_new = {
    name: "Details",
    path: '/receiving-order-inter-doc',
    back: true,
    reduxName: 'stock__transaction_ro',
    fetch: [ "stock__product_requisition", 'stock__transaction_tr', 'stock__transaction_tr_detail',
        "stock__product_requisition_detail", "stock__balance","dropdowns__units_of_measure",
        "dropdowns__ratio"],
    layouts: [
        {
            extra_data: {
                key: 'mapParams',
                params: {
                    to_store: 'licensing__store.active'
                }
            },
            layoutName: 'Request from',
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__transaction_ro',
            compare_deps:['pr','from_store',"id"],
            fields: {
                grid:{
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label: 'RO Invoice: ',
                            type: "DisplayValue",
                            name: 'invoice',
                            style: { fontWeight: 'bold' }
                        },
                        {
                            label: 'Last update: ',
                            type: "DisplayValue",
                            name: 'updated_at',
                            timeStampe: true
                        },
                        {
                            type: 'button_path',
                            label: 'Back'
                        }
                    ]
                },
                form: {
                    type: 'group_grid',
                    grid_temp: '. . . .',
                    group: [{
                        label: "Received Store:",
                        name: 'to_store',
                        type: "display_redux",
                        reduxName: 'licensing__store',
                    }, {
                        name: 'from_store',
                        label: "Sender Store:",
                        type: "display_redux",
                        reduxName: 'licensing__store',
                    }, {
                        label: "Transfer Order: ",
                        deps: ["from_store"],
                        reset_fields: ["from_store"],
                        name: "to",
                        reduxName: "stock__transaction_tr"
                    }, {
                        label: 'Received Date: ',
                        name: 'rec_date',
                        type: "DisplayValue",
                        timeStampe: true
                    }]
                }
            },
        },
        {
            layoutName: "Requested For",
            type: 'Layout_1',
            reduxName: 'stock__transaction_ro_detail',
            list: true,
            full_save: true,
            concat: {
                key: 'reverseKeys',
                levels: ['item_variant']
            },
            link: { transaction: 'stock__transaction_ro.id' },
            init: {
                key: 'List',
                select: { transaction: 'stock__transaction_tr.active' },
                then: {
                    key: 'keys',
                    levels: ['item_variant'],
                },
            },
            fields: [
                {
                    type: 'TableCollapsePluse',
                    deps:["pr"],
                    name: "",
                    showHeader: true,
                    showSubHeader: false,
                    colKey:"stock__transaction_tr",
                    ...FieldsBuild(["stock__menus", "stock__categories", "stock__items", "stock__item_variants"]),
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    rows:{
                        row_filter: {
                            full_form_field_name: "stock__transaction_tr.values.pr",
                            select: 'transaction',
                            path:'stock__product_requisition_detail',
                            pick:'item'
                        },
                        in_row_filter: {
                            deliver_to: 'CWH'
                        },
                        reduxName: 'stock__items'
                    },
                    select: "",
                    fields: [
                        {
                            head: 'Requested',
                            name: 'requested',
                            type: 'CustomLabel',
                            fun:{
                                key: 'selectTo',
                                redux_path:'form.stock__transaction_ro.values.pr',
                               
                            },
                            levels:['stock__items'],
                        },
                        {
                            head: 'Transferred',
                            type: 'CustomLabel',
                            fun: {
                                key: 'selectTransfer',
                                redux_path: "form.stock__transaction_ro.values.pr",
                                
                            },
                            levels:['stock__item_variants'],
                        },
                        {
                            head: 'Received',
                            name: 'received',
                            type: 'DisplayValue',
                            full_form_deps:["stock__transaction_tr.values.pr"],
                            fun: {
                                key: 'VarSum'
                            },
                            levels:['stock__items', 'stock__item_variants'],
                        },
                        {
                            head: 'Reject',
                            name: 'rejected',
                            type: 'DisplayValue',
                            full_form_deps:["stock__transaction_tr.values.pr"],
                            fun: {
                                key: 'VarSum'
                            },
                            levels:['stock__items', 'stock__item_variants'],
                        },
                    ],
                }
            ]
        },
    ]
}

export default add_new;