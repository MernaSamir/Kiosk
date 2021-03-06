import FieldsBuild from 'helpers/fields'

const add_new = {
    name: "Add new",
    path: '/consolidated_to_add',
    reduxName: 'stock__consolidations',
    fetch: [ "stock__product_requisition_detail", "stock__balance", 
    'dropdowns__units_of_measure','dropdowns__ratio'],
    noSave: true,
    noSaveDraft: true,
    back: true,
    
    // full_form_deps:["stock__consolidations.values.prs","stock__consolidations.values.store", "stock__consolidations.values.to_stores"],
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            main:true,
            fixed_data: {
                is_cto: true
            },
            reduxName: 'stock__consolidations',
            fields: [
                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            type: 'group_grid',
                            grid_temp: '. .',
                            grid_gap: '0',
                            group: [
                                {
                                    type: "DisplayValue",
                                    name: 'invoice',
                                    style: { fontWeight: 'bold', margin: '0' }
                                },
                                {
                                    type: "DisplayValue",
                                    name: 'updated_at',
                                    timeStampe: true,
                                    style: { fontSize: '0.8vw', margin: '0' }
                                },
                            ]
                        },
                        {},
                        {
                            type: 'button_path',
                            label: 'Back',
                            push_url: '/consolidated_to_summary'
                        }
                    ]
                },
            ],
            compare_deps:['prs', 'store', "to_stores"]
        },
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__consolidations_detail',
            list: true,
            pers: {
                field: {
                    path: 'form.stock__consolidations.values.prs',
                },
                isempty: true,
            },
            extraSubmitButton:{
                title: 'Generate transfer order',
                reduxName:'stock__transaction_tr',
                child:{
                    reduxName: 'stock__transaction_tr_detail'
                },
                func: 'getPrs',
                func_params:{
                    path:'stock__product_requisition',
                    select:'id'
                },
                concat: {
                    key: 'reverseKeys',
                    levels: ['pr']
                },
                insert:['pr', 'delivery_date', 'from_store', "to_store"],
                modal_fields:[
                    {                        
                        type: 'Add_Table', 
                        name: "",
                        table_columns: [
                            { head: 'Pr', type: 'DisplayValue', name: "name" },
                            { head: 'To', type: "display_redux", name: 'to_store', reduxName: 'licensing__store', },
                            { head: 'Delivery date', type: 'datePicker', name: "delivery_date" },
                        ]  
                        
                    }
                ]
            },
            concat: {
                key: 'reverseKeys',
                levels: ['pr', 'item_variant']
            },
            link: { transaction: 'stock__consolidations.id' },
            full_form_deps:["stock__consolidations.values.prs","stock__consolidations.values.store", "stock__consolidations.values.to_stores"],
            init: {
                key: 'List',
                select: { transaction: 'stock__consolidations.active' },
                then: {
                    key: 'keys',
                    levels: ['pr', 'item_variant'],
                },
                init_filter: {
                    filter_field_name: 'stock__consolidations.values.prs',
                }
            },
            fields: [
                {
                    type: 'TableMultiCol',
                    name: "",
                    showHeader: true,
                    showSubHeader: false,
                    colKey: 'stock__product_requisition',
                    ...FieldsBuild(["stock__menus", "stock__categories", "stock__items", "stock__item_variants"]),
                    rows_filter: {
                        stock__items:{
                            key:'matchDifferent',
                            fullData:"stock__items",
                            path:'stock__product_requisition_detail',
                            filter:'form.stock__consolidations.values.prs',
                            filter_key:'transaction',
                            pick:'item',
                            then:{
                                key:"Filter",
                                params:{
                                    deliver_to: 'CWH'
                                }
                            }
                        },
                    },
                    data_filter: {
                        stock__product_requisition: {
                            key: 'picking',
                            pick: 'form.stock__consolidations.values.prs'
                        }
                    },
                    
                    show : { key: 'GetDataSelector', show: 'full_name' },
                    cols: {
                        reduxName: 'licensing__store',
                        child: {
                            reduxName: 'stock__product_requisition',
                            match: 'to_store'
                        }
                    },
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    fields: [
                        {
                            head: 'Balance',
                            name: 'balance',
                            levels:['stock__item_variants'],
                            type: 'calculator',
                            func: 'calcBalance',
                            params: {
                                match_path: 'stock__product_requisition',
                                match: 'to_store',
                                path: 'stock__balance',
                                pick: 'quantity',
                            },
                        },
                        {
                            head: 'Approved',
                            name: 'approved',
                            levels:['stock__item_variants'],
                            type: 'DisplayValue',
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                        },
                        {
                            head: 'Allocated',
                            name: 'allocated',
                            type: 'number',
                            default_value:"approved",
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                            full_form_deps:["stock__consolidations.values.prs"],
                            levels:['stock__items', 'stock__item_variants'],
                        },
                    ],
                    select: "",
                    total_cols:{
                        title: 'Total Quantity',
                        reduxName:"licensing__store",
                        fields:[
                            {
                                head: 'In hand',
                                name: 'in_hand',
                                levels:['stock__items', 'stock__item_variants'],
                                full_form_deps:["stock__consolidations.values.store"],
                                parent_type: 'DisplayValue',
                                fun: {
                                    key: 'VarSum'
                                },
                                type: 'calculator',
                                func:'adding',
                                params:{
                                    fullFormMatch:true,
                                    filter_field_name:'stock__consolidations.values.store',
                                    select:'store',
                                    path:'stock__balance',
                                    pick: 'quantity',
                                    where:'item_variant',
                                },
                            },
                            {
                                head: 'Approved',
                                name: 'approved',
                                levels:['stock__item_variants'],
                                type: 'calculator',
                                func:'addFromForm',
                                params:{
                                    pick: 'approved',
                                },
                                fun: {
                                    key: 'VarSum'
                                },
                                parent_type: 'DisplayValue',
                            },
                            {
                                head: 'Allocated',
                                name: 'allocated',
                                levels:['stock__items', 'stock__item_variants'],
                                full_form_deps:["stock__consolidations.values.prs"],
                                type: 'calculator',
                                func:'addFromForm',
                                params:{
                                    pick: 'allocated',
                                },
                                parent_type: 'DisplayValue',
                                fun: {
                                    key: 'VarSum'
                                },
                            },
                        ]
                    },
                },
                
            ]
        },
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__consolidations_detail',
            main:true,
            list: true,
            pers: {
                field: {
                    path: 'form.stock__consolidations.values.to_stores',
                },
                isempty: true,
            },
            extraSubmitButton:{
                title: 'Generate transfer order',
                reduxName:'stock__transaction_tr',
                use_store:{path: 'form.stock__consolidations.values.store'},
                child:{
                    reduxName: 'stock__transaction_tr_detail'
                },
                func: 'getStores',
                func_params:{
                    store_key:'to_store'
                },
                insert:['delivery_date', "to_store"],
                modal_fields:[
                    {                        
                        type: 'Add_Table', 
                        name: "",
                        table_columns: [
                            { head: 'To', type: "display_redux", name: 'to_store', reduxName: 'licensing__store', },
                            { head: 'Delivery date', type: 'datePicker', name: "delivery_date" },
                        ]  
                        
                    }
                ]
            },
            concat: {
                key: 'reverseKeys',
                levels: ['to_store', 'item_variant']
            },
            link: { transaction: 'stock__consolidations.id' },
            full_form_deps:["stock__consolidations.values.prs","stock__consolidations.values.store", "stock__consolidations.values.to_stores"],
            init: {
                key: 'List',
                select: { transaction: 'stock__consolidations.active' },
                then: {
                    key: 'keys',
                    levels: ['to_store', 'item_variant'],
                },
                init_filter: {
                    filter_field_name: 'stock__consolidations.values.to_stores',
                }
            },
            fields: [
                {
                    type: 'TableMultiCol',
                    name: "",
                    showHeader: true,
                    showSubHeader: false,
                    colKey: 'licensing__store',
                    cols: {
                        reduxName: 'licensing__store',
                        show : { key: 'GetDataSelector', show: 'full_name' },
                    },
                    ...FieldsBuild(["stock__menus", "stock__categories", "stock__items", "stock__item_variants"]),
                    mainHeader: {
                        name: 'Items', type: ''
                    },
                    collapseAll:true,
                    reseting: {
                        depth: 1,
                        field: 'stock__consolidations.values.to_stores',
                        full_form: true,
                    },
                    full_form_deps: ["stock__consolidations.values.to_stores"],
                    select: "",
                    data_filter: {
                        licensing__store: {
                            key: 'picking',
                            pick: 'form.stock__consolidations.values.to_stores'
                        }
                    },
                    rows_filter: {
                        stock__item_variants:{
                            key:'matchDifferent',
                            fullData:"stock__item_variants",
                            path:'stock__consolidations_detail',
                            filter:'form.stock__consolidations.values.to_stores',
                            filter_key:'to_store',
                            pick:'item_variant',
                        }
                    },
                    fields: [
                        {
                            head: 'Balance',
                            name: 'balance',
                            levels: ['stock__items', 'stock__item_variants'],
                            type: 'calculator',
                            func: 'getBalance',
                            params: {
                                path: 'stock__balance',
                                pick: 'quantity',
                            },
                            parent_type: 'DisplayValue',
                            fun: {
                                key: 'VarSum'
                            },
                        },
                        {
                            head: 'Approved',
                            name: 'approved',
                            levels:['stock__item_variants'],
                            full_form_deps:["stock__consolidations.values.to_stores"],
                            type: 'DisplayValue', 
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                        },
                        {
                            head: 'Allocated',
                            name: 'allocated',
                            type: 'number',
                            default_value:"approved",
                            fun: {
                                key: 'VarSum'
                            },
                            parent_type: 'DisplayValue',
                            full_form_deps:["stock__consolidations.values.to_stores"],
                            levels:['stock__items', 'stock__item_variants'],
                        },
                    
                    ],
                    total_cols:{
                        title: 'Total Quantity',
                        reduxName:"licensing__store",
                        fields:[
                            {
                                head: 'In hand',
                                name: 'in_hand',
                                levels:['stock__items', 'stock__item_variants'],
                                full_form_deps:["stock__consolidations.values.to_stores"],
                                parent_type: 'DisplayValue',
                                fun: {
                                    key: 'VarSum'
                                },
                                type: 'calculator',
                                func:'adding',
                                params:{
                                    fullFormMatch:true,
                                    filter_field_name:'stock__consolidations.values.to_stores',
                                    select:'store',
                                    path:'stock__balance',
                                    pick: 'quantity',
                                    where:'item_variant',
                                },
                            },
                            {
                                head: 'Approved',
                                name: 'approved',
                                levels:['stock__item_variants'],
                                type: 'calculator',
                                func:'addFromForm',
                                params:{
                                    pick: 'approved',
                                },
                                fun: {
                                    key: 'VarSum'
                                },
                                parent_type: 'DisplayValue',
                            },
                            {
                                head: 'Allocated',
                                name: 'allocated',
                                levels:['stock__items', 'stock__item_variants'],
                                full_form_deps:["stock__consolidations.values.to_stores"],
                                type: 'calculator',
                                func:'addFromForm',
                                params:{
                                    pick: 'allocated',
                                },
                                parent_type: 'DisplayValue',
                                fun: {
                                    key: 'VarSum'
                                },
                            },
                        ]
                    },
                }
                
            ]
        },
    ]
}

export default add_new;