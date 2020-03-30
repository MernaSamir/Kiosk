import FieldsBuild from 'helpers/fields'

export default {
    main: {
        layoutName: 'Request from',
        type: 'Layout_2',
        main: true,
        reduxName: 'stock__consolidations',
        fixed_data: {
            'is_cto': true
        },
        compare_deps: ['prs', 'date', 'store'],
        fields: {
            invoice: {
                label: 'CPR Invoice: ',
                type: "DisplayValue",
                name: 'invoice',
                style: { fontWeight: 'bold' }
            },
            grid:{
                type: 'group_grid',
                grid_temp: '. . .',
                group: [
                    {
                        label: 'Last update: ',
                        type: "DisplayValue",
                        name: 'updated_at',
                        timeStampe: true
                    },
                    {
                        type: 'button_path',
                        label: 'Back'
                    },
                ]
            },
           
            store: {
                label: 'From store',
                type: 'select',
                name: "store",
                value: "name",
                reduxName: 'licensing__store'
            },
            date: {
                label: 'Delivery Date',
                type: 'datePicker',
                name: "date"
            },
            prs: {
                label: 'Stores/PRs',
                topLabel: 'Request For',
                name: 'prs',
                value: "name",
                type: 'tree_select',
                //showParentVal:true,
                multiple: true,
                tree: {
                    reduxName: 'licensing__store',
                    child: {
                        reduxName: 'stock__product_requisition',
                        match: 'to_store'
                    }
                },
                reduxName: 'stock__product_requisition',
                deps: ["store", "date"],
                reset_fields: ["store", "date"],
                filter: {
                    key: 'List',
                    select: { from_store: 'store' },
                    then: {
                        key: 'sameDate',
                        compare: 'date',
                        select: 'delivery_date',
                        format: 'YYYY-MM-DD'
                    }
                },
            },
        },
    },
    prs: {
        type: 'Layout_1',
        reduxName: 'stock__consolidations_detail',
        list: true,
        concat: {
            key: 'reverseKeys',
            levels: ['pr', 'item_variant']
        },
        link: { transaction: 'stock__consolidations.id' },
        init: {
            key: 'List',
            select: { transaction: 'stock__consolidations.active' },
            then: {
                key: 'keys',
                levels: ['pr', 'item_variant']
            }
        },
        fields: [
            {
                type: 'TableMultiCol',
                name: "",
                showHeader: true,
                showSubHeader: false,
                colKey: 'stock__product_requisition',
                reseting: {
                    depth: 1,
                    field: 'stock__consolidations.values.prs',
                    full_form: true,
                },
                full_form_deps: ["stock__consolidations.values.store", "stock__consolidations.values.prs"],
                ...FieldsBuild(["stock__menus", "stock__categories", "stock__items", "stock__item_variants"]),
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
                rows: {
                    row_filter: {
                        full_form_field_name: "stock__consolidations.values.prs",
                        select: 'transaction',
                        path: 'stock__product_requisition_detail',
                        pick: 'item'
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
                        levels: ['stock__items', 'stock__item_variants'],
                        type: 'calculator',
                        parent_type: 'DisplayValue',
                        fun: {
                            key: 'Sum'
                        },
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
                        head: 'Requested',
                        name: 'requested',
                        type: 'CustomLabel',
                        func: {
                            select: 'transaction',
                            path: 'stock__product_requisition_detail',
                            pick: 'quantity',
                            where: 'item',
                        },
                        levels: ['stock__items'],
                    },
                    {
                        head: 'Approved',
                        name: 'approved',
                        type: 'number',
                        fun: {
                            key: 'VarSum'
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
                            levels: ['stock__items', 'stock__item_variants'],
                            full_form_deps: ["stock__consolidations.values.store"],
                            parent_type: 'DisplayValue',
                            fun: {
                                key: 'Sum'
                            },
                            type: 'calculator',
                            func: 'adding',
                            params: {
                                full_form: true,
                                filter_field_name: 'stock__consolidations.values.store',
                                select: 'store',
                                path: 'stock__balance',
                                pick: 'quantity',
                                where: 'item_variant',
                            },
                        },
                        {
                            head: 'Requested',
                            full_form_deps: ["stock__consolidations.values.prs"],
                            name: 'requested',
                            type: 'calculator',
                            levels: ['stock__items'],
                            fun: {
                                key: 'Val'
                            },
                            func: 'adding',
                            params: {
                                full_form: true,
                                filter_field_name: 'stock__consolidations.values.prs',
                                select: 'transaction',
                                path: 'stock__product_requisition_detail',
                                pick: 'quantity',
                                where: 'item',
                            }
                        },
                        {
                            head: 'Approved',
                            name: 'approved',
                            type: 'calculator',
                            parent_type: 'DisplayValue',
                            levels: ['stock__items', 'stock__item_variants'],
                            full_form_deps: ["stock__consolidations.values.prs"],
                            func: 'addFromForm',
                            params: {
                                pick: 'approved',
                            },
                            fun: {
                                key: 'VarSum'
                            },

                        },
                    ]
                },
            }
        ]
    },
}