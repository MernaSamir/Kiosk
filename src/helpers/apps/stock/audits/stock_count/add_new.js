const add_new = {
    name: "Details",
    path: '/stock-count',
    reduxName: 'stock__stock_count',
    fetch: [ "stock__balance" ],
    back:true,
    layouts: [
        {
            extra_data: {
                key: 'mapParams',
                params: {
                    store: 'licensing__store.active'
                }
            },
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__stock_count',
            fixed_data: {
                _type: 'st'
            },
            compare_deps:["store"],
            fields: [
                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {},
                        {},
                        {
                            type: 'button_path',
                            label: 'Back',
                            push_url: '/stock-count-summary'
                        }
                    ]
                },
            ]
        },
        {
            type: 'Layout_1',
            reduxName: 'stock__stock_count_detail',
            list:true,
            concat: {
                key: 'reverseKeys',
                levels: ['item_variant']
            },
            link: { audit: 'stock__stock_count.id' },
            init: {
                key: 'List',
                select: { audit: 'stock__stock_count.active' },
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
                    colKey:"stock__stock_count",
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
                            head: 'Quantity',
                            name: 'quantity',
                            type: 'number',
                            child:true,
                        },
                        // {
                        //     name: 'balance',
                        //     child:true,
                        //     full_form_deps: ["stock__stock_count.values.store"],
                        //     type: 'CustomLabel',
                        //     func:"getBalance",
                        //     func_params:{
                        //         reduxMatch: 'licensing__store.active',
                        //         path:"stock__balance"
                        //     }
                        // }
                    ],
                }
            ]
            
        }
        
    ]
}

export default add_new;