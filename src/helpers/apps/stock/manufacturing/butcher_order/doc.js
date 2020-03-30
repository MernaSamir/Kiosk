
const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    justifyContent: 'left'
}

const add_new = {
    name: "New butcher order",
    path: '/butcher_order_doc',
    reduxName: 'stock__butcher_orders',
    back: true,
    noCancel: true,
    noSave:true,
    noSaveDraft:true,
    fetch: ["licensing__store", "stock__butcher", "dropdowns__units_of_measure","stock__butcher_orders_out_detail"],
    layouts: [
        {
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__butcher_orders',
            fields: [

                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label:'Butcher date: ',
                            name:'date',
                            type:'DisplayValue',
                            timeStampe: true,
                            style: { fontSize: '0.8vw', margin: '0' }
                        },
                        {
                            type: 'button_path',
                            label: 'Back',
                            push_url: '/butcher_order_summary'
                        },
                    ]
                },
            ], 
            
        },
        {
            type: 'Layout_1',
            reduxName: 'stock__butcher_orders_in_detail',
            list:true,
            topLabel:"Input",
            concat: {
                key: 'reverseKeys',
                levels: ['item']
            },
            compare_depth: {
                depth: 1,
                fields: ['weight']
            },
            link: { butcher_order: 'stock__butcher_orders.id' },
            init: {
                key: 'List',
                select: { butcher_order: 'stock__butcher_orders.active' },
                then: {
                    key: 'keys',
                    levels: ["item"],
                },
            },
            fields:[
                {
                    type: 'DisplayText',
                    label: 'Input',
                    style: titleStyle
                },
                {
                    type: 'TableCollapsePluse',
                    collapseAll:true,
                    name: "",
                    showHeader: true,
                    showSubHeader: false,
                    colKey:"stock__butcher_orders",
                    reduxName: 'stock__items',
                    child:{
                        reduxName: 'stock__item_variants',
                        match:"item"
                    },
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    rows_filter: {
                        stock__items:{
                            key:'Filter',
                            path:'stock__items',
                            params:{
                                "butcher_active": true
                            },
                        }
                    },
                    select: "",
                    fields: [
                        {
                            head:'stokc UoM',
                            name:'recipe_unit_default',
                            type: "CustomLabel",
                            levels: ['stock__item_variants'],
                            func:"getUom",
                            func_params :{
                                path:'dropdowns__units_of_measure',
                                field_key:'stock_unit',
                                pick:"name"
                            },
                        },
                        {
                            head: 'Weight',
                            name: 'weight',
                            type: 'DisplayValue',
                            levels: ['stock__item_variants'],
                        },
                        {
                            head: 'Purchase Price',
                            name: 'purchase_price',
                            type: 'DisplayValue',
                            levels: ['stock__item_variants'],
                        },
                        {
                            head: 'Processing Cost',
                            name: 'processing_cost',
                            type: 'DisplayValue',
                            levels: ['stock__item_variants'],
                        },
                        {
                            head: 'Total Cost / Stock Unit',
                            name: 'totalcost_uom',
                            type: 'DisplayValue',
                            levels: ['stock__item_variants'],
                        },
                    ],
                }
            ]
            
        },
        {
            type: 'Layout_1',
            reduxName: 'stock__butcher_orders_out_detail',
            list:true,
            topLabel:"Output",
            concat: {
                key: 'reverseKeys',
                levels: ['parent_item','item']
            },
            link: { butcher_order: 'stock__butcher_orders.id' },
            init: {
                key: 'List',
                select: { butcher_order: 'stock__butcher_orders.active' },
                then: {
                    key: 'keys',
                    levels: ['parent_item','item'],
                },
            },
            fields:[
                {
                    type: 'DisplayText',
                    label: 'Output',
                    style: titleStyle
                },
                {
                    type: 'TableCollapsePluse',
                    collapseAll:true,
                    name: "",
                    showHeader: true,
                    showSubHeader: false,
                    colKey:"stock__butcher_orders",
                    reduxName: 'stock__item_variants',
                    child: {
                        reduxName: 'sec_stock__item_variants',
                        alwaysShow:true,
                        add_parent_to_list: true,
                        redux_parent_id:true,
                        filter:{
                            add_id: 'filter',
                            fullData:"stock__item_variants",
                            key:'matchDifferent',
                            path:'stock__butcher',
                            pick:'stock_item_variant',
                            filter_key: 'parent_stock_item_variant',
                        }
                    },
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    rows_filter: {
                        stock__item_variants:{
                            key:'matchDifferent',
                            fullData:"stock__item_variants",
                            path:'stock__butcher',
                            pick:'stock_item_variant',
                            filter_key: 'parent_stock_item_variant',
                            filter:'form.stock__butcher_orders_in_detail.depth_values',
                            get_keys : 'weight',
                            then:{
                                key:'notIncludeParent',
                                path:'stock__butcher',
                                pick: 'stock_item_variant',
                                filter_key: 'parent_stock_item_variant'
                            },
                        }
                    
                    },
                    select: "",
                    fields: [
                        {
                            head:'Stock Unit',
                            name:'uom',
                            levels: ['stock__item_variants','sec_stock__item_variants'],
                            type:"CustomLabel",
                            func:"getUom",
                            func_params :{
                                path:'dropdowns__units_of_measure',
                                field_key:'stock_unit',
                                pick:"name"
                            },
                        },
                        {
                            head: 'Actual Output Stock Units',
                            name: 'actual_weight',
                            type: 'DisplayValue',
                            levels: ['stock__item_variants','sec_stock__item_variants'],
                        },
                        {
                            head: 'No. of Portions',
                            name: 'no_of_portions',
                            type: 'DisplayValue',
                            levels: ['stock__item_variants','sec_stock__item_variants'],
                        },
                        {
                            head: 'Average Portion in Stock Units',
                            name: 'av_portion_weight',
                            type: 'DisplayValue',
                            levels: ['stock__item_variants','sec_stock__item_variants'],
                        },

                    ],
                }
            ]
            
        }
        
    ]
}

export default add_new;