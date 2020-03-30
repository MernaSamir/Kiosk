import FieldsBuild from 'helpers/fields'

const add_new = {
    name: "New Consolidated manufacture plan",
    path: '/consolidated_manufacture_plan',
    reduxName: 'stock__manufacture_orders',
    back: true,
    fetch:["stock__consolidations_detail", "stock__balance", "licensing__store", "dropdowns__units_of_measure"],
    layouts: [
        {
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__manufacture_orders',
            fixed_data: {
                _type: 'cwh'
            },
            compare_deps:["from_store", "cpr"],
            fields: [

                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label: "Manufacturing store",
                            name: 'from_store',
                            type: 'tree_select',
                            multiple: false,
                            tree: {
                                reduxName: 'licensing__store',
                            },
                            filter: {
                                key: 'oring',
                                funs: {
                                    cwh: {
                                        key: 'Filter',
                                        params: {
                                            id: "licensing__store.active",
                                        }
                                    },
                                    childs: {
                                        key: 'Filter',
                                        params: {
                                            parent: "licensing__store.active",
                                        }
                                    }
                                }
                            }
                        },
                        {
                            label: "Transfer to",
                            name: 'to_store',
                            type: 'tree_select',
                            multiple: false,
                            tree: {
                                reduxName: 'licensing__store',
                            },
                            deps: ["from_store"],
                            reset_fields: [ "from_store"],
                            filter: {
                                key: 'oring',
                                funs: {
                                    cwh: {
                                        key: 'Filter',
                                        params: {
                                            id: "licensing__store.active",
                                        }
                                    },
                                    childs: {
                                        key: 'Filter',
                                        params: {
                                            parent: "licensing__store.active",
                                        }
                                    }
                                }
                            }
                        },
                        {
                            label:"CPR",
                            name:'cpr',
                            type: 'tree_select',
                            multiple: false,
                            tree: {
                                reduxName: 'stock__consolidations',
                            },
                            filter: {
                                key: 'Filter',
                                params: {
                                    '_type': 'cwh',
                                    // store: 'from_store'
                                },
                            },
                        },
                        {
                            label:'CMP request date',
                            name:'manufacture_order_date',
                            type:'datePicker',
                            
                        },
                        {
                            type: 'button_path',
                            label: 'Back',
                            push_url: '/consolidated_manufacture_plan_summary'
                        }
                    ]
                },
            ]
        },
        {
            type: 'Layout_1',
            reduxName: 'stock__manufacture_orders_detail',
            list:true,
            rejectDiff: ['balance'],
            concat: {
                key: 'reverseKeys',
                levels: ['item_variant']
            },
            link: { manufacture_order: 'stock__manufacture_orders.id' },
            init: {
                key: 'List',
                select: { manufacture_order: 'stock__manufacture_orders.active' },
                then: {
                    key: 'keys',
                    levels: ['item_variant'],
                },
            },
            defaultValues: {
                field:'quantity',
                default: "cpr_qty",
            },
            fields:[
                {
                    type: 'TableCollapsePluse',
                    collapseAll:true,
                    name: "",
                    showHeader: true,
                    showSubHeader: false,
                    colKey:"stock__manufacture_orders",
                    ...FieldsBuild(["stock__menus", "stock__categories", "stock__items", "stock__item_variants"]),
                    rows_filter: {
                        stock__items:{
                            key:'Filter',
                            path:'stock__items',
                            params:{
                                "manufactured_State": "CE",
                                "_type": "WIP",
                            }, 
                        },
                        stock__item_variants: {
                            is_empty_true: true,
                            key: 'matchDifferent',
                            fullData: "stock__item_variants",
                            path: 'stock__consolidations_detail',
                            filter: 'form.stock__manufacture_orders.values.cpr',
                            filter_key: 'transaction',
                            pick: 'item_variant'
                        },
                    },
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    select: "",
                    fields: [
                        {
                            head: 'Balance',
                            name: 'balance',
                            levels: ['stock__item_variants'],
                            full_form_deps: ["stock__manufacture_orders.values.from_store"],
                            type: 'calculator',
                            func: 'getBalanceOfParent',
                            params: {
                                fullFormMatch: 'stock__manufacture_orders.values.from_store',
                                path: 'stock__balance',
                                parent_path:"licensing__store",
                            },
                        },
                        {
                            head:"CPR quantity",
                            name:'cpr_qty',
                            levels: ['stock__item_variants'],
                            full_form_deps: ["stock__manufacture_orders.values.cpr"],
                            type:'calculator',
                            func:'getFromCPR',
                            params:{
                                key:"Filter",
                                path:'stock__consolidations_detail',
                                params: {
                                    transaction : 'form.stock__manufacture_orders.values.cpr'
                                },
                                pick:'approved',
                                item_key:"item_variant",
                            }
                        },
                        {
                            head: 'To manufacture quantity',
                            name:'quantity',
                            levels: ['stock__item_variants'],
                            type:'number',
                            default_value:"cpr_qty",
                            full_form_deps: ["stock__manufacture_orders.values.cpr"],
                        }
                    ],
                }
            ]
            
        }
        
    ]
}

export default add_new;