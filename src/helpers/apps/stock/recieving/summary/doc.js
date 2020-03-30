import FieldsBuild from 'helpers/fields'
const doc = {
    name: "Doc",
    path: '/recieving_order',
    reduxName: 'stock__transaction_ro',
    back: true,
    noCancel: true,
    noSave:true,
    noSaveDraft:true,
    fetch: [ "stock__product_requisition_detail", "stock__transaction_tr_detail", "stock__balance", 
    'dropdowns__units_of_measure','dropdowns__ratio'],
    layouts:[
        {
            layoutName: 'Request from',
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__transaction_ro',
            compare_deps:['from_vendor',"po","to"],
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
                    group: [
                        {
                            name: 'from_vendor',
                            label: "From:",
                            type: 'display_redux',
                            reduxName: 'parties__vendor',
                        },
                        {
                            name: 'from_store',
                            label: "From:",
                            type: 'display_redux',
                            reduxName: 'licensing__store',
                            pers:{
                                path:"stock__transaction_ro"
                            }
                        },
                        {
                            name: 'rec_date',
                            label: "Recieved date:",
                            type: "DisplayValue",
                            timeStampe: true
                        }
                    ]
                }
            },
        },
        {
            layoutName: "Requested For",
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
                select: { transaction: 'stock__transaction_ro.active' },
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
                    ...FieldsBuild(["stock__menus", "stock__categories", "stock__items", "stock__item_variants"]),
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    rows_filter: {
                        stock__item_variants:{
                            key: 'matchDifferent',
                            fullData: "stock__item_variants",
                            path: 'stock__transaction_ro_detail',
                            filter: 'stock__transaction_ro.active',
                            filter_key: 'transaction',
                            pick: 'item_variant'
                        },
                    },
                    select: "",
                    fields: [
                        {
                            head: 'Purchased',
                            type: 'CustomLabel',
                            full_form_deps:["stock__transaction_ro.active"],
                            fun: {
                                key: 'selectPurchase',
                                redux_path: "form.stock__transaction_ro.values.po"
                            },
                            levels:['stock__item_variants'],
                        },
                        {
                            head: 'Transferred',
                            type: 'CustomLabel',
                            full_form_deps:["stock__transaction_ro.active"],
                            fun: {
                                key: 'selectTransfer',
                                redux_path: "form.stock__transaction_ro.values.to",
                                
                            },
                            levels:['stock__item_variants'],
                        },
                        {
                            head: 'Receive',
                            name: 'received',
                            type: 'DisplayValue',
                            full_form_deps:["stock__transaction_ro.active"],
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                            levels:['stock__items', 'stock__item_variants'],
                        },
                        {
                            head: 'Reject',
                            name: 'rejected',
                            type: 'DisplayValue',
                            full_form_deps:["stock__transaction_ro.active"],
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                            levels:['stock__items', 'stock__item_variants'],
                        },
                        {
                            head: 'Score',
                            name: 'score',
                            full_form_deps:["stock__transaction_ro.active"],
                            type: 'DisplayValue',
                            levels:['stock__item_variants'],
        
                        },
                    ],
                }
            ]
        }
    ]
}
export default doc