import FieldsBuild from 'helpers/fields'
const add_new = {
    name: "Details",
    path: '/transfer-order-inter-add',
    reduxName: 'stock__transaction_tr',
    back: true,
    fetch: [ "stock__product_requisition",
        "stock__product_requisition_detail", "stock__balance","dropdowns__units_of_measure",
        "dropdowns__ratio"],
    layouts: [
        {
            extra_data: {
                key: 'mapParams',
                params: {
                    from_store: 'licensing__store.active'
                }
            },
            layoutName: 'Request from',
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__transaction_tr',
            compare_deps:['pr','from_store',"id"],
            fields: {
                grid:{
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label: 'TO Invoice: ',
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
                    grid_temp: '. . .',
                    group: [{
                        name: 'to_store',
                        label: "Requester Store:",
                        type: 'tree_select',
                        multiple: false,
                        tree: {
                            reduxName: 'licensing__store',
                        },
                        value:"name",
                        reduxName: 'licensing__store',
                        data_filter: {
                            key: 'Reject',
                            params: {
                                id: 'licensing__store.active'
                            }
                        }
                    }, {
                        label: "PR: ",
                        deps: ["to_store"],
                        reset_fields: ["to_store"],
                        name: "pr",
                        multiple: false,
                        type: 'tree_select',
                        tree: {
                            reduxName: "stock__product_requisition"
                        },
                        data_filter: {
                            key: 'Filter',
                            params: { from_store: 'licensing__store.active' }
                        },
                        filter: {
                            key: 'List',
                            select: { to_store: 'to_store' }
                        },
                        
                    }, {
                        name: 'delivery_date',
                        label: "Delivery Date:",
                        type: 'datePicker',
                        default_today: true

                    }]
                }
            },
        },
        {
            layoutName: "Requested For",
            type: 'Layout_1',
            reduxName: 'stock__transaction_tr_detail',
            list: true,
            full_save: true,
            concat: {
                key: 'reverseKeys',
                levels: ['item_variant']
            },
            link: { transaction: 'stock__transaction_tr.id' },
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
                    cols: {
                        col_filter: {
                            full_form_field_name: "stock__transaction_tr.values.id",
                            key: 'ListIncludes',
                            match: 'id',
                        },
                        reduxName: "stock__transaction_tr"
                    },
                    select: "",
                    fields: [
                        {
                            head: 'Requested',
                            name: 'requested',
                            type: 'CustomLabel',
                            fun:{
                                key: 'selectRequested',
                                redux_path: 'form.stock__transaction_tr.values.pr',

                            },
                            levels:['stock__items'],
                        },
                        {
                            head: 'To transfer',
                            name: 'to_transfer',
                            type: 'number',
                            full_form_deps:["stock__transaction_tr.values.pr"],
                            fun: {
                                key: 'VarSum'
                            },
                            child:true,
                            parent_type: 'DisplayValue',
                            levels:['stock__items', 'stock__item_variants'],
                        },
                    ],
                }
            ]
        },
    ]
}

export default add_new;