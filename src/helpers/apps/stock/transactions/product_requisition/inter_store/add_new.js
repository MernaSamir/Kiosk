import FieldsBuild from 'helpers/fields'
const add_new = {
    name: "Details",
    path: '/product-requisition-inter-add',
    reduxName: 'stock__product_requisition',
    back: true,
    fetch: [ "dropdowns__units_of_measure", "licensing__store"],
    layouts: [
        {
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__product_requisition',
            extra_data: {
                key: 'mapParams',
                params: {
                    to_store: 'licensing__store.active'
                }
            },
            fixed_data: {
                '_type': 'CWH'
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
                            name: 'from_store',
                            label: "Requested From:",
                            type: 'tree_select',
                            multiple: false,
                            data_filter: {
                                key: "Reject",
                                params: {
                                    id: 'licensing__store.active'
                                }
                            },
                            tree: {
                                reduxName: 'licensing__store',
                            },
                        },
                        {
                            name: 'delivery_date',
                            label: "Delivery Date:",
                            type: 'datePicker'
                        }
                    ]
                }
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
                    ...FieldsBuild(["stock__menus", "stock__categories", "stock__items"]),
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    select: "",
                    fields: [
                        {
                            head: 'Quantity', name: 'quantity', type: 'number', child: true
                        }
                    ]
                }
            ]
        },
    ]
}

export default add_new;