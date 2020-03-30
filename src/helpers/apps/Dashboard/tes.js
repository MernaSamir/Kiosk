import React from 'react'
// import { getTable } from './../../../api'


const stock_items_cat = {
    name: "Stock Item Categoryqweqwe",
    path: "/stock-catee",
    model: "stock",
    api: "categories",
    layouts: [

        {
            layoutName: 'Basic Information',
            type: 'Layout_2',
            fields: [
                { label: "Name", type: 'text', name: "name" },
                { label: "Altername", type: 'text', name: "alter_name" },
            ]
        },


    ]
}

const stock_items_items = {
    name: "Stock Itemswerwe",
    path: '/stock-itemsww',
    model: "stock",
    api: "item",
    multi: { from: { model: 'stock', api: 'categories' }, match: 'type' },
    // tabs:{this.state.tabsAPI},
    layouts: [

        {
            layoutName: "",
            type: 'Layout_1',
            tabkeys: [1, 2, 3, 4, 5, 6],
            fields: [

                {
                    type: "group", group: [
                        { label: "Name", type: 'text', placeholder: 'Name', name: "name" },
                        { label: "Altername", type: 'text', placeholder: 'Altername', name: "alter_name" },
                        { label: "Code", type: 'text', placeholder: 'Code', name: "code" },
                        { label: "Active", type: 'checkbox', name: "active" },
                    ]
                },
                {
                    type: "group", group: [
                        {
                            type: "group", group: [
                                { label: "Purchase Unit", type: 'number', placeholder: 'Code', name: "code" },
                                { label: <br />, type: 'select', name: "purchase_unit", api: 'units-of-measure', model: 'dropdowns' },
                                { label: <br />, type: 'select', name: "purchase_unit", api: 'units-of-measure', model: 'dropdowns' },

                            ]
                        },
                        { type: 'BigIcon', icon: 'equals', size: 'x', color: '#2b2b2b' },

                        {
                            type: "group", group: [
                                { label: "Stock Unit", type: 'number', placeholder: 'Stock Unit', name: "code" },
                                { label: <br />, type: 'select', name: "stock_unit", api: 'units-of-measure', model: 'dropdowns' },
                                { label: <br />, type: 'select', name: "stock_unit", api: 'units-of-measure', model: 'dropdowns' },


                            ]
                        },
                        { type: 'BigIcon', icon: 'times', size: 'x', color: '#2b2b2b' },

                        {
                            type: "group", group: [
                                { label: "Reciepe Unit", type: 'number', placeholder: 'Reciepe Unit', name: "code" },
                                { label: <br />, type: 'select', name: "recipe_unit", api: 'units-of-measure', model: 'dropdowns' },
                                { label: <br />, type: 'select', name: "recipe_unit", api: 'units-of-measure', model: 'dropdowns' },

                            ]
                        },
                    ]
                },
                {
                    type: "group", group: [
                        { label: "Minimum Stock Limit (in Recipe Unit)", type: 'text', name: "minimum_stock_limit", api: 'items', model: 'stock' },
                        { label: "Maximum Stock Limit (in Recipe Unit)", type: 'text', name: "maximum_stock_limit", api: 'items', model: 'stock' },
                    ]
                },


            ]
        },
        {
            layoutName: "Raw Material Stock Item Variants",
            type: 'Layout_1',
            tabkeys: [1, 2, 3, 4, 5, 6],
            fields: [
                {

                    type: 'Table_add', value: false, name: "Variants", meta: [

                        { label: "Name", name: 'name', type: 'text' },
                        { label: "Altername", name: 'alter_name', type: 'text' },
                        { label: "Code", name: 'code', type: 'number' },
                        { label: "Leadtime", name: 'reorder_leadtime', type: 'text', placeholder: 'dd:hh:mm' },
                        { label: "Default Yield %", name: 'standard_prep_yield', type: 'number' },
                        { label: "Active", name: 'active', type: 'checkbox' }
                    ]
                },

            ]

        },
        {
            layoutName: "",
            type: 'Layout_1',
            tabkeys: [1, 2, 3, 4, 5, 6],

            fields: [
                {
                    type: 'group',
                    direction: 'column',
                    group: [
                        {
                            type: 'Tab',
                            tabs: [
                                {
                                    name: 'Purchased',
                                    label: 'Purchased',
                                    default: true,
                                    body: [
                                        {
                                            type: 'radioBtn',
                                            name: "radioBtn",
                                            list: [

                                                { name: 'Centeral', label: 'Centeral', default: true },
                                                { name: 'Branches', label: 'Branches', },
                                                { name: 'Any', label: 'Any', },


                                            ]
                                        },
                                    ]
                                },
                                {
                                    name: 'Manufactured',
                                    label: 'Manufactured',
                                    body: [
                                        {
                                            type: 'radioBtn',
                                            name: "radioBtn",
                                            list: [

                                                { name: 'Centeral', label: 'Centeral', default: true },
                                                { name: 'Branches', label: 'Branches', },


                                            ]
                                        },
                                    ]
                                }
                            ]
                        },

                        { sideLabel: "Butcher", type: 'checkbox', name: 'Butcher' },

                    ]
                },

            ],
        },
        {
            layoutName: "Butcher Output: Australian Sheep Code 1234",
            type: 'Layout_1',
            tabkeys: [1],
            fields: [
                {
                    type: 'group',
                    direction: 'row',
                    group: [
                        {
                            type: "group", group: [
                                { label: "Quantity in", type: 'number', name: "code" },
                                { label: 'Stock', type: 'select', name: "recipe_unit", api: 'units-of-measure', model: 'dropdowns' },
                                { label: 'Units', type: 'select', name: "recipe_unit", api: 'units-of-measure', model: 'dropdowns' },

                            ],

                            // {
                            //     type: 'dates',
                            //     name: "dates",
                            //     list: [

                            //         { name: 'Reapet Annually', label: 'Reapet Annually', default: true },
                            //         { name: 'Customize Annually', label: 'Customize Annually', }
                            //     ]
                            // },
                        }
                    ]

                }
            ]
        },
        {
            layoutName: "Assign to Location",
            type: 'Layout_2',
            tabkeys: [1, 2, 3, 4, 5, 6],
            fields: [
                {
                    type: 'TableCollapsePluse',
                    name: "locations",
                    showHeader: true,
                    showSubHeader: false,
                    group: { model: 'licensing', api: 'chain', match: 'Chain' },
                    item: { model: 'licensing', api: 'location', active: 'active' },
                    mainHeader: { name: '', type: 'SearchPlus', placeholder: 'Search Location' },
                    groupfeilds: [

                        {
                            main: { name: 'Active' },
                            sub: [
                                { name: "active", type: 'checkbox', display: 'Active' },
                            ]
                        },

                    ],
                    rowFeilds: [
                        { name: "active", type: 'checkbox', display: 'Active' },
                    ]
                },
            ]
        },
    ]
}

const stock_items_bylocation = {
    name:"Stock Items By Locatiowerwern",
    path:'/stock-items-locationqr',
    model:"licensing",
    api:"location",
    multi:{ from: { model: 'licensing', api: 'chain' }, match: 'chain' },
    layouts : [
        {

            layoutName: "",
            type: 'Layout_1',
            fields: [
                {type:'SearchText', placeholder:'Search', width:'100%'},
                {

                    type: 'TableCollapsePluse',
                    name: "colapse",
                    showHeader: true,
                    showSubHeader: true,
                    group: { model: 'stock', api: 'categories', match: 'Chain' },
                    item: { model: 'stock', api: 'items' },
                    mainHeader: { name: 'Items Active', type: '', icon: 'sort' },
                    groupfeilds: [
                        {

                            main: { name: 'Apply to All' },
                            sub: [
                                { name: "", type: 'checkbox', display: '' },


                            ]
                        },

                        {
                            main: { name: 'Chain One' },
                            sub: [
                                { name: "", type: 'checkbox', display: 'Location 1' },
                                { name: "", type: 'checkbox', display: 'Location 2' },

                            ]
                        },
                        {
                            main: { name: 'Chain Two' },
                            sub: [
                                { name: "", type: 'checkbox', display: 'Location 1' },
                                { name: "", type: 'checkbox', display: 'Location 2' },

                            ]
                        }
                    ],
                    rowFeilds: [
                        { name: "", type: 'checkbox', display: 'Location 1' },
                        { name: "", type: 'checkbox', display: 'Location 2' },
                        { name: "", type: 'checkbox', display: 'Location 1' },
                        { name: "", type: 'checkbox', display: 'Location 2' },
                        { name: "", type: 'checkbox', display: 'Location 3' },

                    ]
                },
            ]
        },

    ]
}


const test = {
    name: 'StockItems',
    data: {
        stock_items_cat,
        stock_items_items,
        stock_items_bylocation
    }

}

export default test;
