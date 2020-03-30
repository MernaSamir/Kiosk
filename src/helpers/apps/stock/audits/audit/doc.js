const add_new = {
    name: "Details",
    path: '/audit_doc',
    reduxName: 'stock__audits',
    fetch:['licensing__store'],
    layouts: [
        {
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__audits',
            fields:[
                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {},
                        {},
                        {
                            type: 'button_path',
                            label: 'Back',
                            push_url: '/audit-summary'
                        }
                    ]
                }
            ]
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
                    colKey:"stock__audit_settelments",
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