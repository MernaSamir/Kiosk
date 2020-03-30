const add_new = {
    name: "New return order",
    path: '/return-order',
    reduxName: 'stock__return_order',
    back: true,
    layouts: [
        {
            type: 'Layout_1',
            // main: true,
            reduxName: 'stock__return_order',
            extra_data: {
                key: 'mapParams',
                params: {
                    from_store: 'licensing__store.active'
                }
            },
            compare_deps:["store"],
            fields: [

                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label: "To store",
                            name: 'to_store',
                            type: 'tree_select',
                            multiple: false,
                            tree: {
                                reduxName: 'licensing__store',
                            },
                        },
                        {
                            label:'return date',
                            name:'return_date',
                            type:'datePicker',
                            
                        },
                        {
                            type: 'button_path',
                            label: 'Back',
                            push_url: '/return-order-inter-summary'
                        }
                    ]
                },
            ]
        },
        {
            type: 'Layout_1',
            reduxName: 'stock__return_order_details',
            list:true,
            concat: {
                key: 'reverseKeys',
                levels: ['item_variant']
            },
            link: { return_order: 'stock__return_order.id' },
            init: {
                key: 'List',
                select: { return_order: 'stock__return_order.active' },
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
                    colKey:"stock__return_order",
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
                    select: "",
                    fields: [

                            {
                                head: 'Quantity', name: 'quantity', type: 'number',  levels: ['stock__item_variants']
                            },

                    ],
                }
            ]
            
        }
        
    ]
}

export default add_new;