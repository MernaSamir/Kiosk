import FieldsBuild from 'helpers/fields'
const stock_limits = {
    name: 'Stock Limits',
    path: '/stock-limits',
    reduxName: 'stock__stock_limits',
    layouts: [
        {
            type: 'Layout_1',
            list: true,
            reduxName: 'stock__stock_limits',
            extract: {
                store: {
                    station: 'station.active',

                }
            },
            init: {
                key: 'List',
                then: {
                    key: 'keys',
                    levels: ['store', 'item']
                }
            },
            concat: {
                key: 'reverseKeys',
                levels: ['store', 'item']
            },
            fields: [
                {
                    type: 'TableCollapsePluse',
                    name: "",
                    showHeader: true,
                    select: "licensing__store.active",
                    mainHeader: {
                        name: '', type: ''
                    },
                    colKey: 'licensing__store',
                    filters: {},
                    cols: {
                        reduxName: "licensing__chain",
                        child: {
                            reduxName: 'licensing__location',
                            match: 'chain',
                            child: {
                                reduxName: 'licensing__store',
                                match: 'main_loc'
                            }
                        }
                    },
                    ...FieldsBuild(["stock__menus", "stock__categories", "stock__items"]),
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
                    fields: [
                        {
                            head: 'Minimum',
                            name: 'minimum',
                            type: 'number',
                            // parent: true,
                            child: true
                        },
                        {
                            head: 'Maximum',
                            name: 'maximum',
                            type: 'number',
                            // parent: true,
                            child: true
                        },
                        {
                            head: 'Leadtime(Hours)',
                            type: 'number',
                            name: "leadtime",
                            // parent: true,
                            child: true
                        },
                    ]
                },
            ]
        }
    ]
}

export default stock_limits
