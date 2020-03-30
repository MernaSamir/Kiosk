import FieldsBuild from 'helpers/fields'

const add_new = {
    name: "Manufacture order",
    path: '/manufacture_order',
    reduxName: 'stock__manufacture_orders',
    back: true,
    fetch: ["licensing__store", "dropdowns__units_of_measure"],
    layouts: [
        {
            extra_data: {
                key: 'mapParams',
                params: {
                    to_store: 'licensing__store.active',
                    from_store: 'licensing__store.active',
                }
            },
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__manufacture_orders',
            compare_deps:["store"],
            fields: [

                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        
                        {
                            label:'Manufacture date',
                            name:'manufacture_date',
                            type:'datePicker',
                            
                        },
                        {
                            type: 'button_path',
                            label: 'Back',
                            push_url: '/manufacture'
                        },
                    ]
                },
            ], 
            
        },
        {
            type: 'Layout_1',
            reduxName: 'stock__manufacture_orders_detail',
            list:true,
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
            fields:[
                {
                    type: 'TableCollapsePluse',
                    collapseAll:true,
                    name: "",
                    showHeader: true,
                    showSubHeader: false,
                    colKey:"stock__manufacture_orders",
                    ...FieldsBuild(["stock__menus", "stock__categories", "stock__items", "stock__item_variants"]),
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    rows_filter: {
                        stock__items:{
                            key:'Filter',
                            path:'stock__items',
                            params:{
                                "manufactured_State": "CE",
                                "_type": "WIP",
                            }  
                        },
                        stock__item_variants:{
                            is_empty_true: true,
                            fullData:"stock__item_variants",
                            key:'matchDifferent',
                            path:'stock__manufacture_orders_detail',
                            filter:'stock__manufacture_orders.active',
                            filter_key:'manufacture_order',
                            pick:'item_variant'
                        }
                    },
                    select: "",
                    fields: [

                        {
                            head: 'Manufactured Quantity',
                            name: 'manufactured',
                            type: 'number',
                            child:true,
                        },
                        {
                            head: 'Wasted Quantity',
                            name: 'wasted',
                            type: 'number',
                            child:true,
                        },
                    ],
                }
            ]
            
        }
        
    ]
}

export default add_new;