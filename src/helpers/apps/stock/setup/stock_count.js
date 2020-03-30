import FieldsBuild from 'helpers/fields'
const stock_count = {
    name: 'Stock Count',
    path: '/stock-balance',
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
                            type: 'DisplayValue',
                            levels:['stock__items', 'stock__item_variants']
                        }
                    ]
                },
            ]
        }
    ]
}

export default stock_count
