const add_new = {
    name: "Add New Inter",
    path: '/consolidated_po',
    reduxName: 'stock__consolidations',
    back: true,
    noSave: true,
    fetch: ["stock__product_requisition_detail", "stock__balance", 'dropdowns__units_of_measure'],
    // tableList: {
    //     reduxName: 'stock__consolidations',
    //     filter: {
    //         key: 'Filter',
    //         params: {
    //             'is_cto': true,
    //             'cpo_closed':null
    //         },
    //     }
    // },
    layouts: [
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__consolidations',
            fixed_data: {
                cpo_closed: new Date()
            },
            fields: [
                {
                    type: 'group_grid',
                    grid_temp: '. . .',
                    group: [
                        {
                            label: 'CPO Invoice: ',
                            type: "DisplayValue",
                            name: 'invoice',
                            style: { fontWeight: 'bold' }
                        },
                        {
                            label: 'Last update: ',
                            type: "DisplayValue",
                            name: 'updated_at',
                            timeStampe: true
                        },
                        {
                            type: 'button_path',
                            label: 'Back'
                        }
                    ]
                },],
            compare_deps: ['prs']
        },
        {
            layoutName: "",
            type: 'Layout_1',
            reduxName: 'stock__consolidations_detail',
            list: true,
            concat: {
                key: 'reverseKeys',
                levels: ['pr', 'item_variant']
            },
            link: { transaction: 'stock__consolidations.id' },
            full_form_deps: ["stock__consolidations.values.prs"],
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
            extraSubmitButton: {
                title: 'Generate purchase order',
                reduxName: 'stock__purchase_orders',
                child: {
                    reduxName: 'stock__purchase_orders_detail'
                },
                apply: 'generatePO',
                func: 'getPrs',
                func_params: {
                    path: 'stock__product_requisition',
                    select: 'id'
                },
                concat: {
                    key: 'reverseKeys',
                    levels: ['pr']
                },
                insert: ['pr', 'delivery_date', 'from_store', "to_store"],
                fixed: { "is_po": true },
                modal_fields: [
                    {
                        type: 'Add_Table',
                        name: "",
                        table_columns: [
                            { head: 'Pr', type: 'DisplayValue', name: "name" },
                            { head: 'Delivery date', type: 'datePicker', name: "delivery_date" },
                        ]

                    }
                ]
            },
            fields: [

                {
                    type: 'TableMultiCol',
                    name: "",
                    showHeader: true,
                    showSubHeader: false,
                    colKey: 'stock__product_requisition',
                    reduxName: 'stock__menus',
                    child: {
                        reduxName: 'stock__categories',
                        match: 'menu',
                        child: {
                            reduxName: 'stock__items',
                            match: 'category',
                            child: {
                                reduxName: 'stock__item_variants',
                                match: 'item',
                            }
                        }
                    },
                    rows: {
                        row_filter: {
                            full_form_field_name: "stock__consolidations.values.prs",
                            select: 'transaction',
                            path: 'stock__product_requisition_detail',
                            pick: 'item'
                        },
                        in_row_filter: {
                            deliver_to: 'ST'
                        },
                        reduxName: 'stock__items'
                    },
                    cols: {
                        col_filter: {
                            full_form_field_name: "stock__consolidations.values.prs",
                            key: 'ListIncludes',
                            match: 'id',
                        },
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
                            levels: ['stock__item_variants'],
                            type: 'calculator',
                            func: 'getBalanceValue',
                            params: {
                                match_path: 'stock__product_requisition',
                                match_with: "id",
                                match: 'to_store',
                                select: 'store',
                                path: 'stock__balance',
                                pick: 'quantity',
                                where: 'item_variant',
                            },
                        },
                        {
                            head: 'Approved',
                            name: 'approved',
                            levels: ['stock__item_variants'],
                            type: 'DisplayValue',
                        },
                        {
                            head: 'Allocated',
                            name: 'allocated',
                            type: 'number',
                            fun: {
                                key: 'Sum'
                            },
                            parent_type: 'DisplayValue',
                            full_form_deps: ["stock__consolidations.values.prs"],
                            levels: ['stock__items', 'stock__item_variants'],
                        },
                    ],
                    select: "",
                    total_cols: {
                        title: 'Total Quantity',
                        reduxName: "licensing__store",
                        fields: [
                            {
                                head: 'In hand',
                                name: 'in_hand',
                                levels: ['stock__item_variants'],
                                type: 'calculator',
                                func: 'adding',
                                params: {
                                    filter_field_name: 'sto',
                                    select: 'store',
                                    path: 'stock__balance',
                                    pick: 'quantity',
                                    where: 'item_variant',
                                },
                            },
                            {
                                head: 'Approved',
                                name: 'approved',
                                levels: ['stock__item_variants'],
                                type: 'calculator',
                                func: 'addFromForm',
                                params: {
                                    pick: 'approved',
                                }
                            },
                            {
                                head: 'Allocated',
                                name: 'allocated',
                                levels: ['stock__items', 'stock__item_variants'],
                                full_form_deps: ["stock__consolidations.values.prs"],
                                type: 'calculator',
                                func: 'addFromForm',
                                params: {
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

