const add_new = {
    name: "Add New Vendor",
    path: '/product-requisition-vendor-add',
    reduxName: 'stock__product_requisition',
    back: true,
    layouts: [
        {
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__product_requisition',
            fixed_data: {
                '_type': 'V'
            },
            fields: [
                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label: 'PR Invoice: ',
                            type: "DisplayValue",
                            name: 'invoice',
                            style: { fontWeight: 'bold' }
                        },
                        {
                            label: 'Last update: ',
                            type: "DisplayValue",
                            name: 'updated_at',
                            timeStampe: true
                        },
                        {
                            type: 'button_path',
                            label: 'Back'
                        }
                    ]
                },

                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
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
                            name: 'delivery_date',
                            label: "Delivery Date:",
                            type: 'datePicker'
                        }
                    ]
                },
            ]
        },


        {
            layoutName: "Locations",
            type: 'Layout_1',
            reduxName: 'stock__product_requisition_detail',
            list: true,
            concat: {
                key: 'reverseKeys',
                levels: ['item']
            },
            link: { transaction: 'stock__product_requisition.id' },
            init: {
                key: 'List',
                select: { transaction: 'stock__product_requisition.active' },
                then: {
                    key: 'keys',
                    levels: ['item']
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
                            match: 'category'
                        }
                    },
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    select: "",
                    fields: [
                        {
                            head: 'Quantity', name: 'quantity', type: 'number', child: true
                        },
                    ]
                }
            ]
        },
    ]
}

export default add_new;