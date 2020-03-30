
const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    justifyContent: 'left'
}

const add_new = {
    name: "New butcher order",
    path: '/butcher_order',
    reduxName: 'stock__butcher_orders',
    back: true,
    fetch: ["licensing__store", "stock__butcher", "dropdowns__units_of_measure"],
    layouts: [
        {
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__butcher_orders',
            compare_deps: ['total_processing_cost'],
            fields: [

                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label:'Butcher date: ',
                            name:'date',
                            type:'datePicker',
                        },
                        {
                            type: 'button_path',
                            label: 'Back',
                            push_url: '/butcher_order_summary'
                        },
                    ]
                },
                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label:'Processing cost: ',
                            name:'total_processing_cost',
                            type:'number',
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
                            head:'Stock Unit',
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
                            type: 'number',
                            levels: ['stock__item_variants'],
                            change_permission: {
                                error_message:"Cant input two items that have same outputs",
                                func: "check_same_children",
                                func_params:{
                                    parent_field:"parent_stock_item_variant",
                                    child_field: "stock_item_variant",
                                    path:"stock__butcher",
                                    all_parents_path:"form.stock__butcher_orders_in_detail.depth_values"
                                }
                            }
                        },
                        {
                            head: 'Purchase Price',
                            name: 'purchase_price',
                            type: 'number',
                            levels: ['stock__item_variants'],
                        },
                        {
                            head: 'Processing Cost',
                            name: 'processing_cost',
                            type: 'calculator',
                            levels: ['stock__item_variants'],
                            full_form_deps:['form.stock__butcher_orders.values.total_processing_cost'],
                            func:"getProcessingCost",
                            params:{
                                path:'form.stock__butcher_orders.values.total_processing_cost',
                                sum_path:"form.stock__butcher_orders_in_detail.depth_values",
                                sum_field_name: 'weight',
                            }
                        },
                        {
                            head: 'Total Cost',
                            name: 'totalcost',
                            type: 'DisplayValue',
                            levels: ['stock__item_variants'],
                            linked: {
                                compares: ['purchase_price', 'processing_cost', 'totalcost_uom'],
                                current: {
                                    key: 'Eval',
                                    eq: 'purchase_price + processing_cost'
                                },
                            } 
                        },
                        {
                            head: 'Total Cost / Stock Unit',
                            name: 'totalcost_uom',
                            type: 'DisplayValue',
                            levels: ['stock__item_variants'],
                            linked: {
                                compares: ['purchase_price', 'processing_cost', 'totalcost_uom', 'weight'],
                                current: {
                                    key: 'Eval',
                                    eq: '(purchase_price + processing_cost)/ weight'
                                },
                            } 
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
            compare_depth: {
                depth: 2,
                fields: ['actual_weight','no_of_portions']
            },
            fields:[
                {
                    type: 'DisplayText',
                    label: 'Output',
                    style: titleStyle
                },
                { 
                    label: "Actual output Sum: ", 
                    name: "actual_output_sum",
                    type: 'calculator',
                    func:"gePercentSum",
                    full_form_deps:["stock__butcher_orders_out_detail.depth_values"],
                    params :{
                        path:'form.stock__butcher_orders_out_detail.depth_values',
                        field_key:'actual_weight',
                        depth: true,
                        desired_sum: 100
                    }, 
                },
                {
                    type: 'TableCollapsePluse',
                    collapseAll:true,
                    name: "",
                    showHeader: true,
                    showSubHeader: false,
                    reduxName: 'stock__item_variants',
                    full_form_deps:["stock__butcher_orders_out_detail.depth_values"],
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
                                filter_key: 'parent_stock_item_variant',
                                add_table_parent_id: true,
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
                            type: 'number',
                            levels: ['stock__item_variants','sec_stock__item_variants'],
                        },
                        {
                            head: 'No. of Portions',
                            name: 'no_of_portions',
                            type: 'number',
                            levels: ['stock__item_variants','sec_stock__item_variants'],
                            permission:{
                                filter:{
                                    key:"Find",
                                    parent_key: "parent_stock_item_variant",
                                    child_key:"stock_item_variant",
                                    path:"stock__butcher",
                                    pick:"has_portions"
                                }
                            }
                        },
                        {
                            head: 'Average Portion in Stock Units',
                            name: 'av_portion_weight',
                            levels: ['stock__item_variants','sec_stock__item_variants'],
                            permission:{
                                filter:{
                                    key:"Find",
                                    parent_key: "parent_stock_item_variant",
                                    child_key:"stock_item_variant",
                                    path:"stock__butcher",
                                    pick:"has_portions"
                                }
                            },
                            type:"calculator",
                            func:"getAvWeight",
                            params:{
                                path: "form.stock__butcher_orders_out_detail.depth_values",
                                total_field: "actual_weight",
                                portions_field:  'no_of_portions',
                            }

                        },

                    ],
                }
            ]
            
        }
        
    ]
}

export default add_new;