import FieldsBuild from 'helpers/fields'

const add_new = {
    name: "Manufacture order",
    path: '/consolidated_manufacture_plan_doc',
    reduxName: 'stock__manufacture_orders',
    fetch:["licensing__store", "stock__consolidations", "dropdowns__units_of_measure"],
    //back: true,
    layouts: [
        {
            type: 'Layout_1',
            main: true,
            reduxName: 'stock__manufacture_orders',
            fixed_data: {
                _type: 'cwh'
            },
            compare_deps:["store"],
            fields: [

                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label: "From: ",
                            name: 'from_store',
                            type: 'display_redux',
                            reduxName: 'licensing__store',
                        },
                        {
                            label: "To: ",
                            name: 'to_store',
                            type: 'display_redux',
                            reduxName: 'licensing__store',
                        },
                        {
                            label: "CPR: ",
                            name: 'cpr',
                            type: 'display_redux',
                            reduxName: 'stock__consolidations',
                        },
                        {
                            label:'CMP request date: ',
                            name:'manufacture_order_date',
                            type:'DisplayValue',
                            timeStampe: true,
                        },
                        {
                            type: 'button_path',
                            label: 'Back',
                            push_url: '/consolidated_manufacture_plan_summary'
                        },
                    ]
                },
            ]
        },
        {
            type: 'Layout_1',
            reduxName: 'stock__manufacture_orders_detail',
            list:true,
            concat: {
                key: 'reverseKeys',
                levels: ['item_variant']
            },
            link: { manufacture_order: 'stock__manufacture_orders.id' },
            init: {
                key: 'List',
                select: { manufacture_order: 'stock__manufacture_orders.active' },
                then: {
                    key: 'keys',
                    levels: ['item_variant'],
                },
            },
            fields:[
                {
                    type: 'TableCollapsePluse',
                    collapseAll:true,
                    name: "",
                    showHeader: true,
                    showSubHeader: false,
                    colKey:"stock__manufacture_orders",
                    ...FieldsBuild(["stock__menus", "stock__categories", "stock__items", "stock__item_variants"]),
                    rows_filter: {
                        stock__items:{
                            key:'Filter',
                            path:'stock__items',
                            params:{
                                "manufactured_State": "CE"
                            }
                        },
                        stock__item_variants:{
                            fullData:"stock__item_variants",
                            key:'matchDifferent',
                            path:'stock__manufacture_orders_detail',
                            filter:'stock__manufacture_orders.active',
                            filter_key:'manufacture_order',
                            pick:'item_variant'
                        }
                    },
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    select: "",
                    fields: [
                        {
                            head: 'Balance',
                            name: 'balance',
                            levels: ['stock__item_variants'],
                            full_form_deps: ["stock__manufacture_orders.values.from_store"],
                            type: 'DisplayValue',
                        },
                        {
                            head:"CPR quantity",
                            name:'cpr_qty',
                            levels: ['stock__item_variants'],
                            type:'DisplayValue',
                        },
                        {
                            head: 'To manufacture quantity',
                            name:'quantity',
                            levels: ['stock__item_variants'],
                            type:'DisplayValue',
                        }
                    ],
                }
            ]
            
        }
        
    ]
}

export default add_new;