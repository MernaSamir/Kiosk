import FieldsBuild from 'helpers/fields'

const add_new = {
    name: "New vendor invoice",
    path: '/vendor-invoice',
    reduxName: 'stock__vendor_invoices',
    back: true,
    fetch: ['dropdowns__units_of_measure',"parties__vendor_by_stock_items", 
        "stock__purchase_orders_detail"],
    layouts: [
        {
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__vendor_invoices',
            compare_deps:["po", "vendor", "vat"],
            fields: [

                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label: "Vendor",
                            name: 'vendor',
                            type: 'tree_select',
                            multiple: false,
                            value:"name",
                            tree: {
                                reduxName: 'parties__vendor'
                            }
                        },
                        {
                            label:'Vendor invoice no.',
                            name:'vendor_invoice_no',
                            type:'text',
                            
                        },
                        {
                            label: "Purchase order",
                            name: 'po',
                            type: 'tree_select',
                            multiple: false,
                            value:"name",
                            tree: {
                                reduxName: 'stock__purchase_orders'
                            },
                            deps: ["vendor"],
                            reset_fields: ["vendor"],
                            filter: {
                                key: 'Filter',
                                params:{
                                    vendor: "vendor"
                                }
                            },
                        },
                        {
                            name:'vat',
                            label:"Vat",
                            type:"checkbox",
                        },
                    ]
                },
            ]
        },
        {
            type: 'Layout_1',
            reduxName: 'stock__vendor_invoices_detail',
            list:true,
            concat: {
                key: 'reverseKeys',
                levels: ['item_variant']
            },
            link: { vendor_invoice: 'stock__vendor_invoices.id' },
            init: {
                key: 'List',
                select: { vendor_invoice: 'stock__vendor_invoices.active' },
                then: {
                    key: 'keys',
                    levels: ['item_variant'],
                },
            },
            fields:[
                {
                    type: 'TableCollapsePluse',
                    name: "",
                    showHeader: true,
                    showSubHeader: false,
                    collapseAll:true,
                    ...FieldsBuild(["stock__menus", "stock__categories", "stock__items", "stock__item_variants"]),
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    select: "",
                    full_form_deps: ["stock__vendor_invoices.values.vat", "stock__vendor_invoices.values.po"],
                    column_filter:{
                        vat_percent:{
                            path: "form.stock__vendor_invoices.values.vat"
                        }
                    },
                    rows_filter: {
                        stock__item_variants:{
                            key:'matchDifferent',
                            fullData:"stock__item_variants",
                            path:'parties__vendor_by_stock_items',
                            filter:'form.stock__vendor_invoices.values.vendor',
                            filter_key:'vendor',
                            pick:'item_variant'
                        },
                    },
                    fields: [
                        {
                            type: 'number', 
                            name: "recieved_quantity", 
                            head: 'Recieved quantity',
                            levels: ['stock__item_variants'], 
                        },
                        { 
                            type: 'number', 
                            name: "vat_percent", 
                            head: 'Vat %',
                            levels: ['stock__item_variants'], 
                        },
                        {
                            type: 'number', 
                            name: "recieved_item_price", 
                            head: 'Recieved item price',
                            levels: ['stock__item_variants'], 
                        },
                        {
                            type: 'number', 
                            name: "total_price", 
                            head: 'Total price',
                            levels: ['stock__item_variants'],
                            linked: {
                                name: 'recieved_item_price',
                                is_total: true ,
                                compares: ['recieved_item_price', 'vat_percent', 'recieved_quantity'],
                                link: {
                                    key: 'Eval',
                                    defaults:{
                                        vat_percent: 0
                                    },
                                    eq: 'total_price / ( recieved_quantity +( recieved_quantity * vat_percent / 100 ))',
                                },
                                current: {
                                    key: 'Eval',
                                    defaults:{
                                        vat_percent: 0
                                    },
                                    eq: 'recieved_item_price * ( recieved_quantity +( recieved_quantity * vat_percent / 100 ))',
                                    
                                },
                                deps: ['recieved_quantity', 'recieved_item_price']
                            }
                        },
                        {
                            head: 'Ordered quantity',
                            name: 'ordered_quantity',
                            levels: ['stock__item_variants'],
                            type: 'calculator',
                            func:"getReqValue",
                            full_form_deps: [ "stock__vendor_invoices.values.po"],
                            params :{
                                path:'stock__purchase_orders_detail',
                                field_key:'transaction',
                                field_value:'form.stock__vendor_invoices.values.po',
                                item_key:'item_variant',
                                pick:"allocated"
                            },
                        },
                        {
                            head: 'Ordered price',
                            name: 'ordered price',
                            levels: ['stock__item_variants'],
                            type: 'calculator',
                            full_form_deps: [ "stock__vendor_invoices.values.po"],
                            func:"getReqValue",
                            params :{
                                path:'stock__purchase_orders_detail',
                                field_key:'transaction',
                                field_value:'form.stock__vendor_invoices.values.po',
                                item_key:'item_variant',
                                pick:"price"
                            },
                        },
                        {
                            head: 'Last price',
                            name: 'last_price',
                            levels:['stock__item_variants'],
                            type: 'calculator',
                            full_form_deps: [ "stock__vendor_invoices.values.po"],
                            func:"getReqValue",
                            params :{
                                path:'stock__purchase_orders_detail',
                                field_key:'transaction',
                                field_value:'form.stock__vendor_invoices.values.po',
                                item_key:'item_variant',
                                pick:"last_price"
                            },
                        },
                    ]
                },
            ]
            
        }
        
    ]
}

export default add_new;