const stock_limits = {
    name: 'Stock Limits',
    path: '/stock-limits',
    reduxName: 'stock__stock_limits',
    layouts: [
        {
            type: 'Layout_1',
            reduxName: 'stock__stock_limits',
            init: {
                key: 'List',
                then: {
                    key: 'keys',
                    levels: ['key']
                }
            },
            concat: {
                key: 'reverseKeys',
                levels: ['key']
            },
            fields: [
                
            ]
        }
    ]
}

export default stock_limits
