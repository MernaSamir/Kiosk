const favorite = {
    name: 'Inbox',
    path: '/price-by-pos',
    reduxName: 'items__price_by_pos',
    // hide_actions: true,
    // fetch: ['parties__vendor'],
    layouts: [
        {
            layoutName: "Basic Information",
            type: 'Layout_1',
            list: true,
            reduxName: 'items__price_by_pos',
            init: {
                key: 'List',
                selectors: {
                },
                then: {
                    key: 'keys',
                    levels: ['station', 'item']
                }
            },
            concat: {
                key: 'reverseKeys',
                levels: ['station', 'item']
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
                        match: 'base_sales_cat',
                        child: {
                            reduxName: 'items__prices',
                            match: 'sales_item',
                            show: {
                                key: 'joining',
                                select: [{ 
                                    key: 'chain',
                                    selectors: {
                                        items__sales_items: 'sales_item'
                                    },
                                    then: {
                                        key: 'GetDataSelector',
                                        show: 'name'
                                    },
                                }, {
                                    key: 'chain',
                                    selectors: {
                                        dropdowns__units_of_measure: 'sales_unit'
                                    },
                                    then: {
                                        key: 'GetDataSelector',
                                        show: 'name'
                                    },
                                }]
                            },
                        }
                    },
                    filters: {
                    },
                    colKey: 'licensing__station',
                    cols: {
                        reduxName: "licensing__station",
                    },
                    fields: [
                        { head: 'Active', name: "active", type: "checkbox", parent: true, child: true },
                        { head: 'Price', name: 'price', type: 'number', parent: true, child: true}
                    ]
                },
            ]
        }
    ]
}

export default favorite