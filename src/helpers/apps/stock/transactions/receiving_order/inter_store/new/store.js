import FieldsBuild from 'helpers/fields'

export default {
    main: {
        extra_data: {
            key: 'mapParams',
            params: {
                to_store: 'licensing__store.active',
                _type: 'form.extra._type'
            }
        },
        tabkeys: ['cwh'],
        layoutName: 'Request from',
        type: 'Layout_1',
        main: true,
        reduxName: 'stock__transaction_ro',
        compare_deps:['to','from_store',"id"],
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
                    name: 'from_store',
                    label: "Sender Store:",
                    type: 'tree_select',
                    multiple: false,
                    tree: {
                        reduxName: 'licensing__store',
                    },
                    value:"name",
                    reduxName: 'licensing__store',
                    data_filter: {
                        key: 'Reject',
                        params: {
                            id: 'licensing__store.active'
                        }
                    }
                }, {
                    label: "Transfer Order: ",
                    deps: ["from_store"],
                    reset_fields: ["from_store"],
                    name: "to",
                    multiple: false,
                    type: 'tree_select',
                    tree: {
                        reduxName: "stock__transaction_tr"
                    },
                    data_filter: {
                        key: 'Filter',
                        params: { to_store: 'licensing__store.active' }
                    },
                    filter: {
                        key: 'List',
                        select: { from_store: 'from_store' }
                    },
                }, {
                    label: 'Received Date: ',
                    name: 'rec_date',
                    type: 'datePicker'
                }]
            }
        },
    },
    from_store: {
        layoutName: "Requested For",
        tabkeys: ['cwh'],
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
                deps:["to"],
                name: "",
                showHeader: true,
                showSubHeader: false,
                colKey:"stock__transaction_tr",
                ...FieldsBuild(["stock__menus", "stock__categories", "stock__items", "stock__item_variants"]),
                mainHeader: {
                    name: 'Items', type: ''
                },
                rows:{
                    row_filter: {
                        full_form_field_name: "stock__transaction_tr.values.to",
                        select: 'transaction',
                        path:'stock__product_requisition_detail',
                        pick:'item'
                    },
                    in_row_filter: {
                        deliver_to: 'CWH'
                    },
                    reduxName: 'stock__items'
                },
                select: "",
                fields: [
                    {
                        head: 'Requested',
                        name: 'requested',
                        type: 'CustomLabel',
                        fun:{
                            key: 'selectTo',
                            redux_path:'form.stock__transaction_ro.values.to',
                           
                        },
                        levels:['stock__items'],
                    },
                    {
                        head: 'Transferred',
                        type: 'CustomLabel',
                        fun: {
                            key: 'selectTransfer',
                            redux_path: "form.stock__transaction_ro.values.to",
                            
                        },
                        levels:['stock__item_variants'],
                    },
                    {
                        head: 'Receive',
                        name: 'received',
                        type: 'number',
                        full_form_deps:["stock__transaction_tr.values.to"],
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
                        full_form_deps:["stock__transaction_tr.values.to"],
                        fun: {
                            key: 'VarSum'
                        },
                        parent_type: 'DisplayValue',
                        levels:['stock__items', 'stock__item_variants'],
                    },
                ],
            }
        ]
    },
}