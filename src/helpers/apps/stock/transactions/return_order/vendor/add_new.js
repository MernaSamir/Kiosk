const add_new = {
    name: "Add New Vendor",
    path: '/return-order-vendor-add',
    reduxName: 'stock__transaction',
    // tableList: {
    //     reduxName: 'stock__transaction',
    //     filter: {
    //         key: 'Filter',
    //         params: {
    //             '_type': 'ReO',
    //             sub_type: 'V'
    //         },
    //         then: {
    //             key: "Reject",
    //             params: {
    //                 'from_vendor': null
    //             }
    //         }
    //     }
    // },
    layouts: [
        {
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__transaction',
            fixed_data: {
                _type: 'ReO',
                sub_type: 'V'
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
                    name: 'from_vendor',
                    label: "Requested From Vendor:",
                    type: 'tree_select',
                    multiple: false,
                    tree: {
                        reduxName: 'parties__vendor',
                    },
                },
                {
                    label: "RO:",
                    type: 'select',
                    name: "parent",
                    mode: 'default',
                    reduxName: 'stock__transaction',
                    filter: {
                        key: 'Filter',
                        params:{'_type':'RO', sub_type: 'V'}
                    }
                }, {
                    name: 'delivery_date',
                    label: "Delivery Date:",
                    type: 'datePicker',
                    default_today: true

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
                            head: 'Rec. Total Qty', name: 'rec_tot_qty', type: 'number', parent: true, child: true
                        },
                        {
                            head: 'Rec. Expiry', name: 'rec_exp', type: 'number', parent: true, child: true
                        },
                        {
                            head: 'Ret. Total Qty', name: 'ret_tot_qty', type: 'number', parent: true, child: true
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