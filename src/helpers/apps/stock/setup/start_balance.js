import FieldsBuild from 'helpers/fields'
import {start_balance_cond as cond} from 'helpers/fields/common'
const start_balance = {
    name: 'Balance',
    path: '/balance',
    reduxName: 'stock__balance',
    fetch: ['dropdowns__units_of_measure', 'dropdowns__ratio'],
    layouts: [
        {
            type: 'Layout_1',
            list: true,
            reduxName: 'stock__balance',
            init: {
                key: 'List',
                then: {
                    key: 'keys',
                    levels: ['store', 'item_variant']
                }
            },
            concat: {
                key: 'reverseKeys',
                levels: ['store', 'item_variant']
            },
            fields: [
                {
                    type: 'TableMultiCol',
                    name: "",
                    apply_all: true,
                    colKey: 'licensing__store',
                    ...FieldsBuild(["stock__menus", "stock__categories", "stock__items", "stock__item_variants"]),
                    data_filter: {
                        licensing__store: {key: "pickingBy", params: {main_loc: 'licensing__location.active'}},
                    },
                    labels: {
                        fields: [{
                            head: 'Code',
                            name: 'code',
                            type: 'DataDisplay',
                            child: true,
                            show: {
                                key: 'GetDataSelector',
                                show: 'code'
                            }
                        }]
                    },
                    filters: {},
                    cols: {
                        reduxName: 'licensing__store'
                    },
                    fields: [
                        {
                            name: 'quantity',
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                            cond,
                            levels:['stock__items', 'stock__item_variants']
                        },
                        {
                            name: 'price',
                            fun: {
                                key: 'VarSum'
                            },
                            cond,
                            levels:['stock__items', 'stock__item_variants']
                        },
                    ]
                },
            ]
        }
    ]
}

export default start_balance
