const add_new = {
    name: "Details",
    path: '/stock-count_doc',
    reduxName: 'stock__stock_count',
    fetch:['licensing__store'],
    noSave:true,
    noCancel:true,
    noSaveDraft:true,
    layouts: [
        {
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__stock_count',
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
                            push_url: '/stock-count-settelment-summary'
                        }
                    ]
                }
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