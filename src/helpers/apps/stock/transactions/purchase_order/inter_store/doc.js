const doc = {
    name: "Document",
    path: '/consolidated_po_doc',
    reduxName: 'stock__purchase_orders',
    back: true,
    noSave: true,
    fetch: ["stock__balance",  'dropdowns__units_of_measure',
        "parties__vendor_by_stock_items", ],
    // tableList: {
    //     reduxName: 'stock__consolidations',
    //     filter: {
    //         key: 'Filter',
    //         params: {
    //             'is_cto': false,
    //             'cto_closed':null,
    //             'is_draft': false,
    //             '_type':'v',
    //         },
    //     }
    // },
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__purchase_orders',
            fields: [
                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            type: 'group_grid',
                            grid_temp: '. .',
                            grid_gap: '0',
                            group: [
                                {
                                    type: "DisplayValue",
                                    name: 'invoice',
                                    style: { fontWeight: 'bold', margin: '0' }
                                },
                                {
                                    type: "DisplayValue",
                                    name: 'updated_at',
                                    timeStampe: true,
                                    style: { fontSize: '0.8vw', margin: '0' }
                                },
                            ]
                        },
                        {},
                        {
                            type: 'button_path',
                            label: 'Back',
                            push_url: '/consolidated_po_summary'
                        }
                    ]
                },
                
                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            type: 'group_grid',
                            grid_temp: '. .',
                            grid_gap: '0',
                            group: [
                                {
                                    label: 'From vendor',
                                    type: "DisplayRelativeValue",
                                    reduxName: 'parties__vendor',
                                    name: "vendor",
                                    topLabel: 'Request From',
                                },
                            ]
                                            
                        },
                    ]
                    
                },
            ],
            compare_deps: ['vendor', "stores"]
        },
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__purchase_orders_detail',
            list: true,
            concat: {
                key: 'reverseKeys',
                levels: ['to_store', 'item_variant']
            },
            link: { transaction: 'stock__purchase_orders.id' },
            full_form_deps: ["stock__purchase_orders.values.stores", "stock__purchase_orders.values.vendor"],
            init: {
                key: 'List',
                select: { transaction: 'stock__purchase_orders.active' },
                then: {
                    key: 'keys',
                    levels: ['to_store', 'item_variant'],
                },
                init_filter: {
                    filter_field_name: 'stock__purchase_orders.values.stores',
                }
            },
            fields: [

                {
                    type: 'TableMultiCol',
                    name: "",
                    showHeader: true,
                    showSubHeader: false,
                    colKey: 'licensing__store',
                    reduxName: 'stock__menus',
                    collapseAll:true,
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
                    rows_filter: {
                        stock__item_variants:{
                            fullData:"stock__item_variants",
                            key:'matchDifferent',
                            path:'stock__purchase_orders_detail',
                            filter:'form.stock__purchase_orders.values.stores',
                            filter_key:'to_store',
                            pick:'item_variant',
                        }
                    },

                    data_filter: {
                        licensing__store: {
                            key: 'pickingBy',
                            params: {
                                id: 'licensing__store.active' 
                            }
                        }
                    },
                    cols: {
                        reduxName: 'licensing__store',
                    },
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    fields: [
                        {
                            head: 'Approved',
                            name: 'approved',
                            levels: ['stock__items', 'stock__item_variants'],
                            type: 'DisplayValue',
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                        },
                        {
                            head: 'Purchase now',
                            name: 'allocated',
                            type: 'DisplayValue',
                            levels: ['stock__items', 'stock__item_variants'],
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                        },
                    ],
                    select: "",
                }
            ]
        },
    ]
}

export default doc;

