const favorite = {
    name: 'Inbox',
    path: '/favorite',
    reduxName: 'items__favorite',
    // hide_actions: true,
    // fetch: ['parties__vendor'],
    layouts: [
        {
            layoutName: "Basic Information",
            type: 'Layout_1',
            list: true,
            reduxName: 'items__favorite',
            init: {
                key: 'List',
                selectors: {
                },
                then: {
                    key: 'keys',
                    levels: ['station', 'sales_item']
                }
            },
            concat: {
                key: 'reverseKeys',
                levels: ['station', 'sales_item']
            },
            fields: [
                {
                    type: 'TableMultiCol',
                    name: "",
                    apply_all: true,
                    redux_name: '',
                    reduxName: 'items__base_sales_cat',
                    child: {
                        reduxName: 'items__sales_items',
                        match: 'base_sales_cat'
                    },
                    filters: {
                    },
                    colKey: 'licensing__station',
                    cols: {
                        reduxName: "licensing__station",
                    },
                    fields: [
                        {head: 'Active', name: "active", type: "checkbox", parent: true, child: true}
                    ]
                },
            ]
        }
    ]
}

export default favorite