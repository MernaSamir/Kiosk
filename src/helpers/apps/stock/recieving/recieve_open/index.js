import FieldsBuild from 'helpers/fields'
const add_new = {
    name: "Add new",
    path: '/recieve_open',
    reduxName: 'stock__transaction_ro',
    fetch: [ "stock__balance",'dropdowns__units_of_measure','dropdowns__ratio','parties__vendor_by_stock_items'],
    back: true,
    layouts:[
        {
            extra_data: {
                key: 'mapParams',
                params: {
                    to_store: 'licensing__store.active',
                    _type: 'o',
                }
            },
            layoutName: 'Request From',
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__transaction_ro',
            compare_deps:['from_vendor'],
            fields: {
                grid:{
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label: 'From vendor: ',
                            type: 'tree_select',
                            name: "from_vendor",
                            value: "name",
                            multiple: false,
                            tree: {
                                reduxName: 'parties__vendor'
                            }
                        },
                        {
                            label: 'Received Date: ',
                            name: 'rec_date',
                            type: 'datePicker',
                            default_today: true
                        },
                        {
                            type: 'button_path',
                            label: 'Back'
                        }
                    ]
                },
            },
        },
        {
            layoutName: "Recieved",
            type: 'Layout_1',
            reduxName: 'stock__transaction_ro_detail',
            list: true,
            full_save: true,
            concat: {
                key: 'reverseKeys',
                levels: ['item_variant']
            },
            link: { transaction: 'stock__transaction_ro.id' },
            fields: [
                {
                    type: 'TableCollapsePluse',
                    deps:["pr"],
                    name: "",
                    showHeader: true,
                    showSubHeader: false,
                    ...FieldsBuild(["stock__menus", "stock__categories", "stock__items", "stock__item_variants"]),
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    rows_filter: {
                        stock__item_variants:{
                            key:'matchDifferent',
                            fullData:"stock__item_variants",
                            path:'parties__vendor_by_stock_items',
                            filter:'form.stock__transaction_ro.values.from_vendor',
                            filter_key:'vendor',
                            pick:'item_variant'
                        },
                    },

                    select: "",
                    fields: [

                        {
                            head: 'Receive',
                            name: 'received',
                            type: 'number',
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                            levels:['stock__items', 'stock__item_variants'],
                        },
                        {
                            head: 'Reject',
                            name: 'rejected',
                            type: 'number',
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                            levels:['stock__items', 'stock__item_variants'],
                        },

                    ],
                }
            ]
        }
    ]
}

export default add_new