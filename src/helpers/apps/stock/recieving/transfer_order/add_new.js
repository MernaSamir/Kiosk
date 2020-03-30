import FieldsBuild from 'helpers/fields'

const add_new = {
    name: "Add new",
    path: '/transfer_order',
    reduxName: 'stock__transaction_tr',
    fetch: [ "stock__product_requisition_detail", "stock__transaction_tr_detail","stock__balance", 
    'dropdowns__units_of_measure','dropdowns__ratio'],
    back: true,
    noCancel: true,
    layouts: [
        {
            layoutName: 'Request from',
            reduxName: 'stock__transaction_ro',
            extra_data: {
                key: 'mapParams',
                params: {
                    to_store: 'licensing__store.active',
                    _type: 'cwh',
                    to:"stock__transaction_tr.active"
                }
            },
            type: 'Layout_1',
            main: true,
            compare_deps:['to','from_store',"id"],
            fields: {
                grid:{
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label: 'TR Invoice: ',
                            type: "DisplayValue",
                            name: 'invoice',
                            style: { fontWeight: 'bold' }
                        },
                        // {
                        //     label: 'Last update: ',
                        //     type: "DisplayValue",
                        //     name: 'updated_at',
                        //     timeStampe: true
                        // },
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
                        full_form_deps:["stock__transaction_tr.active"],
                        type: 'display_redux',
                        reduxName: 'licensing__store',
                        initValue: {
                            key: 'chain',
                            selectors: {
                                'stock__transaction_tr': "stock__transaction_tr.active",
                            },
                            display:'from_store'
                        }
                    }, 
                    {
                        label: 'Received Date: ',
                        name: 'rec_date',
                        type: 'datePicker',
                        default_today: true
                    }]
                }
            },
        },
        {
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
                    ...FieldsBuild(["stock__menus", "stock__categories", "stock__items", "stock__item_variants"]),
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    rows_filter:{
                        stock__item_variants:{
                            key: 'matchDifferent',
                            fullData: "stock__item_variants",
                            path: 'stock__transaction_tr_detail',
                            filter: 'stock__transaction_tr.active',
                            filter_key: 'transaction',
                            pick: 'item_variant'
                        },
                    },
                    select: "",
                    fields: [
                        {
                            head: 'Requested',
                            name: 'requested',
                            type: 'CustomLabel',
                            fun:{
                                key: 'selectTo',
                                redux_path:'stock__transaction_tr.active',
                                
                            },
                            levels:['stock__items'],
                        },
                        {
                            head: 'Transferred',
                            name:'transfered',
                            type: 'calculator',
                            func: "normalFilterCustomLabel",
                            params:{
                                fun: {
                                    key: 'selectTransfer',
                                    redux_path: "stock__transaction_tr.active",
                                    
                                },
                            },
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                            levels:['stock__items','stock__item_variants'],
                        },
                        {
                            head: 'Receive',
                            name: 'received',
                            type: 'number',
                            default_value:'transfered',
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
        }
    ]

}
export default add_new