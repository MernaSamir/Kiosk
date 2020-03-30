import FieldsBuild from 'helpers/fields'

export default {
    vendor: {
        extra_data: {
            key: 'mapParams',
            params: {
                to_store: 'licensing__store.active',
                _type: 'form.extra._type'
            }
        },
        tabkeys: ['v'],
        layoutName: 'Request from',
        type: 'Layout_1',
        main: true,
        reduxName: 'stock__transaction_ro',
        compare_deps:['from_vendor', 'po'],
        fields: {
            grid:{
                type: 'group_grid',
                grid_temp: '. . .',
                group: [
                    {
                        label: 'RO Invoice: ',
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
            form: {
                type: 'group_grid',
                grid_temp: '. . .',
                group: [{
                    name: 'from_vendor',
                    label: "Vendor:",
                    type: 'tree_select',
                    multiple: false,
                    tree: {
                        reduxName: 'parties__vendor',
                    },
                    value:"name",
                    reduxName: 'parties__vendor'
                }, {
                    label: "Purchase Order: ",
                    deps: ["from_vendor"],
                    reset_fields: ["from_vendor"],
                    name: "po",
                    multiple: false,
                    type: 'tree_select',
                    tree: {
                        reduxName: "stock__purchase_orders"
                    },
                    filter: {
                        key: 'Filter',
                        params: { vendor: 'from_vendor',  }
                    },
                    data_filter: {
                        key: 'DataIncludes',
                        select: 'stores',
                        pick: 'licensing__store.active'
                    },
                }, {
                    label: 'Received Date: ',
                    name: 'rec_date',
                    type: 'datePicker'
                }]
            }
        },
    },
    from_vendor: {
        layoutName: "Requested For",
        tabkeys: ['v'],
        type: 'Layout_1',
        reduxName: 'stock__transaction_ro_detail',
        list: true,
        full_save: true,
        concat: {
            key: 'reverseKeys',
            levels: ['item_variant']
        },
        link: { transaction: 'stock__transaction_ro.id' },
        init: {
            key: 'List',
            select: { transaction: 'stock__transaction_tr.active' },
            then: {
                key: 'keys',
                levels: ['item_variant'],
            },
        },
        fields: [
            {
                type: 'TableCollapsePluse',
                deps:["pr"],
                name: "",
                showHeader: true,
                showSubHeader: false,
                colKey:"stock__transaction_tr",
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
                    // stock__items:{
                    //     key:'matchDifferent',
                    //     fullData:"stock__items",
                    //     path:'stock__product_requisition_detail',
                    //     filter:'form.stock__consolidations.values.prs',
                    //     filter_key:'transaction',
                    //     pick:'item',
                    // }
                },
                select: "",
                fields: [
                    {
                        head: 'Purchased',
                        type: 'CustomLabel',
                        fun: {
                            key: 'selectPurchase',
                            redux_path: "form.stock__transaction_ro.values.po"
                        },
                        levels:['stock__item_variants'],
                    },
                    {
                        head: 'Receive',
                        name: 'received',
                        type: 'number',
                        full_form_deps:["stock__transaction_tr.values.pr"],
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
                        full_form_deps:["stock__transaction_tr.values.pr"],
                        fun: {
                            key: 'VarSum'
                        },
                        parent_type: 'DisplayValue',
                        levels:['stock__items', 'stock__item_variants'],
                    },
                    {
                        head: 'Score',
                        name: 'score',
                        type: 'number',
                        levels:['stock__item_variants'],

                    },
                ],
            }
        ]
    },
}