import FieldsBuild from 'helpers/fields'
const add_new = {
    name: "Add new",
    path: '/purchase_order',
    reduxName: 'stock__purchase_orders',
    fetch: [ "stock__product_requisition_detail", "stock__balance", 
    'dropdowns__units_of_measure','dropdowns__ratio'],
    back: true,
    noCancel: true,
    layouts:[
        {
            extra_data: {
                key: 'mapParams',
                params: {
                    to_store: 'licensing__store.active',
                    _type: 'v',
                    po:"stock__purchase_orders.active"
                }
            },
            layoutName: 'Request from',
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__transaction_ro',
            compare_deps:['from_vendor'],
            fields: {
                grid:{
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label: 'PO Invoice: ',
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
                        name: 'from_vendor',
                        label: "Vendor:",
                        full_form_deps:["stock__purchase_orders.active"],
                        type: 'display_redux',
                        reduxName: 'parties__vendor',
                        initValue: {
                            key: 'chain',
                            selectors: {
                                'stock__purchase_orders': "stock__purchase_orders.active",
                            },
                            display:'vendor'
                        }
                    }, 
                    {
                        label: 'Received Date: ',
                        name: 'rec_date',
                        type: 'datePicker',
                        default_today: true
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
                    rows_filter: {
                        stock__item_variants:{
                            key: 'matchDifferent',
                            fullData: "stock__item_variants",
                            path: 'stock__purchase_orders_detail',
                            filter: 'stock__purchase_orders.active',
                            filter_key: 'transaction',
                            pick: 'item_variant'
                        },
                        // stock__items:{
                        //     key:'matchDifferent',
                        //     fullData:"stock__items",
                        //     path:'stock__product_requisition_detail',
                        //     filter:'form.stock__consolidations.values.prs',
                        //     filter_key:'transaction',
                        //     pick:'item',
                        // }
                    },
                    select: "",
                    fields: [
                        {
                            head: 'Purchased',
                            name:'purchased',
                            type: 'calculator',
                            func: "normalFilterCustomLabel",
                            params:{
                                fun: {
                                    key: 'selectPurchase',
                                    redux_path: "stock__purchase_orders.active"
                                },
                            },
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                            levels:['stock__items','stock__item_variants'],
                        },
                        {
                            head: 'Receive',
                            name: 'received',
                            type: 'number',
                            default_value:"purchased",
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                            levels:['stock__items', 'stock__item_variants'],
                        },
                        {
                            head: 'Reject',
                            name: 'rejected',
                            type: 'number',
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                            levels:['stock__items', 'stock__item_variants'],
                        },
                        {
                            head: 'Score',
                            name: 'score',
                            type: 'number',
                            levels:['stock__item_variants'],
        
                        },
                    ],
                }
            ]
        }
    ]
}
export default add_new