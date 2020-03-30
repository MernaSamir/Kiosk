const items_printer = {
    name: "Items by Kitchen Display",
    path: '/items-printer',
    reduxName: 'items__item_printers',
    // tableList: {
    //     reduxName: 'items__item_printers'
    // },
    layouts: [
        {
            layoutName: "",
            type: "Layout_1",
            list: true,
            reduxName: "items__item_printers",
            init: {
                key: 'List',
                selectors: {
                },
                then: {
                    key: 'keys',
                    levels: ['group', 'item']
                }
            },
            concat: {
                key: 'reverseKeys',
                levels: ['group', 'item']
            },
            fields: [
                {
                    type: 'TableMultiCol',
                    name: "",
                    apply_all: true,
                    colKey: 'settings__printer_group',
                    redux_name: '',
                    reduxName: 'items__custom_menu',
                    child: {
                        reduxName: 'items__base_sales_cat',
                        match: 'custom_menu',
                        child: {
                            reduxName: 'items__sales_items',
                            match: 'base_sales_cat'
                        }
                    },
                    cols: {
                        reduxName: 'settings__printer_group',
                        filter: {
                            key: 'Filter',
                            params: {
                                'location': 'licensing__location.active'
                            }
                        }
                    },

                    fields: [

                        {
                            head: '', name: 'active', type: 'checkbox', parent: true, child: true
                        },

                    ]
                }
            ]



        }
    ]
}


export default items_printer;