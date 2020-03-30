const add_new = {
    name: "Add New Inter",
    path: '/stock-adjustment-add',
    reduxName: 'stock__transaction',
    layouts: [
        {
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__transaction',
            fixed_data: {
                _type: 'WO'
            },
            fields: [
                {
                    name: 'to_store',
                    label: "Requested To Store:",
                    type: 'tree_select',
                    multiple: false,
                    tree: {
                        reduxName: 'licensing__store',
                    },
                },
                {
                    name: 'from_store',
                    label: "Requested From Store:",
                    type: 'tree_select',
                    multiple: false,
                    tree: {
                        reduxName: 'licensing__store',
                    },
                }
            ]
        },


        {
            layoutName: "Locations",
            type: 'Layout_1',
            reduxName: 'stock__transaction_detail',
            list: true,
            concat: {
                key: 'reverseKeys',
                levels: ['item_variant']
            },
            link: { transaction: 'stock__transaction.id' },
            init: {
                key: 'List',
                select: { transaction: 'stock__transaction.active' },
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
                            head: 'Quantity', name: 'quantity', type: 'number', parent: true, child: true
                        },
                        {
                            head: 'Expiry', name: 'qty_exp', type: 'number', parent: true, child: true
                        },
                        {
                            name: 'reason',
                            head: "Reason",
                            type: 'tree_select',
                            multiple: false,
                            tree: {
                                reduxName: 'dropdowns__reasons',
                            },
                            parent: true,
                            child: true
                        }
                    ]
                }
            ]
        },
    ]
}

export default add_new;