const add_new = {
    name: "waste order",
    path: '/waste-order-doc',
    reduxName: 'stock__waste_order',
    fetch:["licensing__store"],
    back: true,
    noSave:true,
    noCancel:true,
    noSaveDraft:true,
    layouts: [
        {
            type: 'Layout_1',
            // main: true,
            reduxName: 'stock__waste_order',
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
                            type: 'button_path',
                            label: 'Back',
                            push_url: '/waste_order_summary'
                        },
                        {
                            label:'waste date: ',
                            name:'waste_date',
                            type:'DisplayValue',
                            timeStampe: true,
                        },
                    ]
                },
            ]
        },
        {
            type: 'Layout_1',
            reduxName: 'stock__waste_order_details',
            list:true,
            concat: {
                key: 'reverseKeys',
                levels: ['item_variant']
            },
            link: { waste_order: 'stock__waste_order_.id' },
            init: {
                key: 'List',
                select: { waste_order: 'stock__waste_order.active' },
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
                    colKey:"stock__waste_order",
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
                        // stock__items:{
                        //     key:'Filter',
                        //     path:'stock__items',
                        //     params:{
                        //         "manufactured_State": "BR"
                        //     }
                        // },
                        stock__item_variants:{
                            fullData:"stock__item_variants",
                            key:'matchDifferent',
                            path:'stock__waste_order_details',
                            filter:'stock__waste_order.active',
                            filter_key:'waste_order',
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
                    ],
                }
            ]
            
        }
        
    ]
}

export default add_new;