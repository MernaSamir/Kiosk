import FieldsBuild from 'helpers/fields'
const add_new = {
    name: "Document",
    path: '/product-requisition-inter-doc',
    reduxName: 'stock__product_requisition',
    hide_actions: true,
    noCancel: true,
    noSave:true,
    noSaveDraft:true,
    fetch: [ "dropdowns__units_of_measure", "licensing__store"],
    layouts: [
        {
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__product_requisition',
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
                            label: 'Requester: ',
                            type: "display_redux",
                            name: 'to_store',
                            reduxName: 'licensing__store',
                        },
                        {
                            label: 'Requested From: ',
                            type: "display_redux",
                            name: 'from_store',
                            reduxName: 'licensing__store',
                        },
                        {
                            label: 'Delivery Date: ',
                            type: "DisplayValue",
                            name: 'delivery_date',
                            timeStampe: true
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
                    collapseAll: true,
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
                            head: 'Quantity', name: 'quantity', type: 'DisplayValue', child: true
                        }
                    ]
                }
            ]
        },
    ]
}

export default add_new;