const add_new = {
    name: "Manufacture order",
    path: '/manufacture_order_cwh_doc',
    reduxName: 'stock__manufacture_orders',
    fetch:["licensing__store"],
    //back: true,
    layouts: [
        {
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__manufacture_orders',
            fixed_data: {
                _type: 'cwh'
            },
            compare_deps:["store"],
            fields: [

                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            type: "DisplayValue",
                            name: 'mo_invoice',
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
                            label:'Manufacture date: ',
                            name:'manufacture_date',
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
            ]
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
                                "manufactured_State": "CE"
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
                            child:true,
                        },
                        {
                            head: 'Manufactured Quantity',
                            name: 'manufactured',
                            type: 'DisplayValue',
                            child:true,
                        },
                        {
                            head: 'Wasted Quantity',
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