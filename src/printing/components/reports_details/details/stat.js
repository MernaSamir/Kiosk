 export default (BusinessDay) => {
    let apps = [
        {
            url: "orders/receipt-items/",
            name: "settings__mode",
            request: {
                "groupby": "receipt__order__mode__name",
                "filter": [
                    {
                        "field": "receipt__order__shift__date",
                        "eq": "exact",
                        "val": "4d933cf3-6fd2-43be-87c9-712e206d3f79"
                    }
                    ],
                "eval": [
                    {
                        "alias": "count",
                        "fun": "count",
                        "eq": "'receipt'",
                        "extra": {"distinct": true}
                    },
                    {
                        "alias": "net_sales",
                        "fun": "sum",
                        "eq": "(F('quantity')*F('price')) - F('discount')"
                    },
                    {
                        "alias": "gross_sales",
                        "fun": "sum",
                        "eq": "(F('quantity')*F('price')) - F('discount') + F('service')"
                    },
                    {
                        "alias": "grand_total",
                        "fun": "sum",
                        "eq": "(F('quantity')*F('price')) - F('discount') + F('tax')"
                    },
                    {
                        "alias": "sum",
                        "fun": "sum",
                        "eq": "'receipt___discount'",
                        "extra": {"distinct": true}
                    }
                    ]
            }


        },
        {
            url: 'orders/payment/',
            name: "payment_types",
            request: {
                "groupby": "payment_type__name",
                "filter": [
                    {
                        "field": "order__shift__date",
                        "eq": "exact",
                        "val": BusinessDay.id
                    }
                ],
                "eval": [
                    {
                        "alias": "paid",
                        "fun": "sum",
                        "eq": "F('paid')-F('change')"
                    }
                ]
            }

        },
        {
            url: 'pay/pay/',
            name: "pay_types",
            request: {
                "groupby": "_type__name",
                "filter": [
                    {
                        "field": "shift__date",
                        "eq": "exact",
                        "val": BusinessDay.id
                    }
                ],
                "eval": [
                    {
                        "alias": "amount",
                        "fun": "sum",
                        "eq": "'amount'"
                    }
                ]
            }

        }, {
            url: 'orders/receipt-items/',
            name: "menues",
            request: {
                "groupby": "details__item__sales_item__base_sales_cat__custom_menu__name",
                "filter": [
                    {
                        "field": "receipt__order__shift__date",
                        "eq": "exact",
                        "val": BusinessDay.id
                    }
                ],
                "eval": [
                    {
                        "alias": "net_sales",
                        "fun": "sum",
                        "eq": "(F('quantity') * F('price'))-F('discount')"
                    },
                    {
                        "alias": "groos_sales",
                        "fun": "sum",
                        "eq": "F('quantity') * F('price')"
                    }
                ]
            }

        },
    ]
    return apps
}
