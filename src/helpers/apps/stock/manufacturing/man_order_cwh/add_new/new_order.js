import FieldsBuild from 'helpers/fields'

const add_new = {
    name: "Manufacture order",
    path: '/manufacture_order_cwh',
    reduxName: 'stock__manufacture_orders',
    back: true,
    noSaveDraft: true,
    fetch: ["licensing__store", "dropdowns__units_of_measure"],
    layouts: [
        {
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
                            type: "DisplayValue",
                            name: 'invoice',
                            style: { fontWeight: 'bold', margin: '0' }
                        },
                        {
                            label: "From: ",
                            name: 'from_store',
                            type: 'display_redux',
                            reduxName: 'licensing__store',
                        },
                        {
                            label: "To: ",
                            name: 'to_store',
                            type: 'display_redux',
                            reduxName: 'licensing__store',
                        },
                        {
                            label: "CPR: ",
                            name: 'cpr',
                            type: 'display_redux',
                            reduxName: 'stock__consolidations',
                        },
                        {
                            label:'CMP request date: ',
                            name:'manufacture_order_date',
                            type:'DisplayValue',
                            timeStampe: true,
                        },
                        {
                            type: 'button_path',
                            label: 'Back',
                            push_url: '/manufacture_cwh'
                        },
                    ]
                },
                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label:'Manufacture date',
                            name:'manufacture_date',
                            type:'datePicker',
                            
                        },
                    ]
                }
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
                            head: 'CMP Quantity',
                            name: 'quantity',
                            type: 'DisplayValue',
                            levels:['stock__item_variants']
                        },
                        {
                            head: 'Manufactured Quantity',
                            name: 'manufactured',
                            type: 'number',
                            default_value:"quantity",
                            levels:['stock__item_variants']
                        },
                        {
                            head: 'Wasted Quantity',
                            name: 'wasted',
                            type: 'number',
                            levels:['stock__item_variants']
                        },
                    ],
                }
            ]
            
        }
        
    ]
}

export default add_new;