const add_new = {
    name: "Details",
    path: '/audit',
    reduxName: 'stock__audits',
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
            reduxName: 'stock__audits',
            compare_deps:["store"],
        },
        {
            type: 'Layout_1',
            reduxName: 'stock__audits_detail',
            list:true,
            concat: {
                key: 'reverseKeys',
                levels: ['item_variant']
            },
            link: { audit: 'stock__audits.id' },
            init: {
                key: 'List',
                select: { audit: 'stock__audits.active' },
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
                    colKey:"stock__audits",
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
                    ],
                }
            ]
            
        }
        
    ]
}

export default add_new;