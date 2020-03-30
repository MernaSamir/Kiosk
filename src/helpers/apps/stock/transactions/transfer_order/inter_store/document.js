import FieldsBuild from 'helpers/fields'

const add_new = {
    name: "Document",
    path: '/transfer-order-doc',
    reduxName: 'stock__transaction_tr',
    hide_actions: true,
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
                group: {
                    type: 'group_grid',
                    grid_temp: '. . . .',
                    group: [
                        {
                            label: 'Pr: ',
                            type: "display_redux",
                            reduxName: "stock__product_requisition",
                            name: 'pr'
                        },
                        {
                            label: 'Transfer From: ',
                            type: "display_redux",
                            name: 'to_store',
                            reduxName: 'licensing__store',
                        },
                        {
                            label: 'Transfer To: ',
                            type: "display_redux",
                            name: 'from_store',
                            reduxName: 'licensing__store',
                        },
                        {
                            label: 'Delivery Date: ',
                            name: 'delivery_date',
                            type: "DisplayValue",
                            timeStampe: true
                        }
                    ]
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
                    collapseAll: true,
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
                            type: 'DisplayValue',
                            full_form_deps:["stock__transaction_tr.values.pr"],
                            fun: {
                                key: 'VarSum'
                            },
                            child:true,
                            levels:['stock__items', 'stock__item_variants'],
                        },
                    ],
                }
            ]
        },
    ]
}

export default add_new;