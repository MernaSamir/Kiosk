const add_new = {
    name: "Add New Inter",
    back: true,
    path: '/waste-order',
    reduxName: 'stock__waste_order',
    layouts: [
        {
            type: 'Layout_1',
            // main: true,
            reduxName: 'stock__waste_order',
            extra_data: {
                key: 'mapParams',
                params: {
                    from_store: 'licensing__store.active'
                }
            },
            fields: [

                {
                    type: 'group_grid',
                    grid_temp: '. .',
                    group: [
                        {
                            label:'Waste date',
                            name:'waste_date',
                            type:'datePicker',
                            default_today: true

                            
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
            extra_data: {
                key: 'mapParams',
                params: {
                    from_store: 'licensing__store.active'
                }
            },
            // layoutName: "Locations",
            type: 'Layout_1',
            reduxName: 'stock__waste_order_details',
            list: true,
            concat: {
                key: 'reverseKeys',
                levels: ['item_variant']
            },
            link: { waste_order: 'stock__waste_order.id' },
            init: {
                key: 'List',
                select: { waste_order: 'stock__waste_order.active' },
                then: {
                    key: 'keys',
                    levels: ['item_variant']
                }
            },
            fields: [
                {
                    type: 'TableCollapsePluse',
                    name: "",
                    showHeader: true,
                    showSubHeader: false,
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
                    ]
                }
            ]
        },
    ]
}

export default add_new;