

const add_new = {
    name: "Add New Inter",
    path: '/purchase-order-inter-add',
    reduxName: 'stock__purchase_orders',
    back: true,
    fetch: [ "stock__product_requisition",
        "stock__product_requisition_detail", "stock__balance","dropdowns__units_of_measure",
        "dropdowns__ratio"],
    // tableList: {
    //     reduxName: 'stock__purchase_orders',
    //     filter: {
    //         key: 'List',
    //         select: {},
    //         then: {
    //             key: 'Filter',
    //             params: {
    //                 'po_closed': null,
    //             },
    //         }
    //     }
    // },
    layouts: [
        {
            layoutName: 'Request from',
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__purchase_orders',
            compare_deps:['pr','from_store',"id"],
            fields: {
                stores : {
                    name: 'to_store',
                    label: "Requested To Store:",
                    type: 'select',
                    value:"name",
                    reduxName: 'licensing__store'
                },
            }
                

        },
        {
            layoutName: "Locations",
            type: 'Layout_1',
            reduxName: 'stock__purchase_orders_detail',
            list: true,
            concat: {
                key: 'reverseKeys',
                levels: ['item_variant']
            },
            link: { transaction: 'stock__purchase_orders.id' },
            init: {
                key: 'List',
                select: { transaction: 'stock__purchase_orders.active' },
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
                    reduxName: 'stock__menus',
                    child: {
                        reduxName: 'stock__categories',
                        match: 'menu',
                        child: {
                            reduxName: 'stock__items',
                            match: 'category',
                            child: {
                                reduxName: 'stock__item_variants',
                                match: 'item',
                            }
                        }
                    },
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
                            deliver_to: 'ST'
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
                            head: 'Balance',
                            name: 'balance',
                            levels:['stock__item_variants'],
                            child:true,
                            type: 'calculator',
                            func:'getBalanceValue',
                            full_form_deps:["stock__transaction_tr.values.pr"],
                            params:{
                                fullFormMatch:'stock__transaction_tr.values.pr',
                                match_path:'stock__product_requisition',
                                match_with:"id",
                                match:'to_store',
                                select:'store',
                                path:'stock__balance',
                                pick: 'quantity',
                                where:'item_variant',
                            },
                        },
                        // {
                        //     head: 'Requested',
                        //     name: 'requested',
                        //     type: 'CustomLabel',
                        //     func:{
                        //         fullFormMatch:'stock__transaction_tr.values.pr',
                        //         select: 'transaction',
                        //         path:'stock__product_requisition_detail',
                        //         pick: 'quantity',
                        //         where:'item',
                        //     },
                        //     child:true,
                        //     levels:['stock__items'],
                        // },
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