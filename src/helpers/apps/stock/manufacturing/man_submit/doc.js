
const add_new = {
    name: "Manufacture order",
    path: '/manufacture_submit_order_doc',
    reduxName: 'stock__manufacture_orders',
    back: true,
    fetch: ["licensing__store"],
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
                            type: 'button_path',
                            label: 'Back',
                            push_url: '/manufacture_submit_order_summary'
                        },
                        {
                            label:'Order date: ',
                            name:'manufacture_order_date',
                            type:'DisplayValue',
                            timeStampe: true,
                        },
                        {
                            label:'Manufacture date',
                            name:'manufacture_date',
                            type:'DisplayValue',
                            timeStampe: true,
                        },
                    ]
                },
                // {
                //     type: 'group_grid',
                //     grid_temp: '. . .',
                //     group: [
                //         {
                //             label:'Manufacture date',
                //             name:'manufacture_date',
                //             type:'DisplayValue',
                //             timeStampe: true,
                //         },
                //     ]
                // }
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
                    rows_filter: {
                        stock__items:{
                            key:'Filter',
                            path:'stock__items',
                            params:{
                                "manufactured_State": "BR"
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
                            head: 'Quantity',
                            name: 'quantity',
                            type: 'DisplayValue',
                            child:true,
                        },
                        {
                            head: 'Manufactured',
                            name: 'manufactured',
                            type: 'DisplayValue',
                            child:true,
                        },
                        {
                            head: 'Wasted',
                            name: 'wasted',
                            type: 'DisplayValue',
                            child:true,
                        },
                    ],
                }
            ]
            
        }
        
    ]
}

export default add_new;