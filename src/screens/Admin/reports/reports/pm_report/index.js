import React, { Component } from 'react'
import Container from '../../components/container'
import {get} from 'lodash'
import {connect} from 'react-redux'

const group_by = {
    "model": "orders__details",
    "fun": "analysisRevenuDetails",
    "levels": [
        {
            "type": "chain",
            "selects": {
                "items__prices": "item_id",
                "items__sales_items": "sales_item_id",
                "items__base_sales_cat": "base_sales_cat_id",
                "items__custom_menu": "custom_menu_id"
            },
            "col": "department_id"
        },
        {
            "type": "chain",
            "selects": {
                "items__prices": "item_id",
                "items__sales_items": "sales_item_id",
                "items__base_sales_cat": "base_sales_cat_id"
            },
            "col": "custom_menu_id"
        },
        {
            "type": "chain",
            "selects": {
                "items__prices": "item_id",
                "items__sales_items": "sales_item_id"
            },
            "col": "base_sales_cat_id"
        }
    ]
}

const models = (station)=>({
    orders__business_days: {
        filter: {
            location: station.location
        },
        keys: {
            start: {key: 'created_at__gte'},
            end: {key: 'created_at__lte'},
        }
    },
    orders__shifts: {
        filter: {
            date__location: station.location
        },
        keys: {
            start: {key: 'date__created_at__gte'},
            end: {key: 'date__created_at__lte'},
            shift: {key: 'shift_num'}
        }
    },
    orders__main: {
        filter: {
            shift__date__location: station.location
        },
        keys: {
            start: {key: 'shift__date__created_at__gte'},
            end: {key: 'shift__date__created_at__lte'},
            shift: {key: 'shift__shift_num'},
            station: {key: "station"},
            cashier: {key: "cashier"},
            waiter: {key: 'serve'}
        }
    },
    orders__details: {
        filter: {
            order__shift__date__location: station.location
        },
        keys: {
            start: {key: 'order__shift__date__created_at__gte'},
            end: {key: 'order__shift__date__created_at__lte'},
            station: {key: "order__station"},
            shift: {key: 'order__shift__shift_num'},
            cashier: {key: "order__cashier"},
            waiter: {key: 'order__serve'}
        }
    },
    orders__receipt: {
        filter: {
            order__shift__date__location: station.location
        },
        keys: {
            start: {key: 'order__shift__date__created_at__gte'},
            end: {key: 'order__shift__date__created_at__lte'},
            station: {key: "order__station"},
            shift: {key: 'order__shift__shift_num'},
            cashier: {key: "order__cashier"},
            waiter: {key: 'order__serve'}
        }
    },
    orders__payment: {
        filter: {
            order__shift__date__location: station.location
        },
        keys: {
            start: {key: 'order__shift__date__created_at__gte'},
            end: {key: 'order__shift__date__created_at__lte'},
            station: {key: "order__station"},
            shift: {key: 'order__shift__shift_num'},
            cashier: {key: "order__cashier"},
            waiter: {key: 'order__serve'}
        }
    },
    orders__receipt_items: {
        filter: {
            receipt__order__shift__date__location: station.location
        },
        keys: {
            start: {key: 'receipt__order__shift__date__created_at__gte'},
            end: {key: 'receipt__order__shift__date__created_at__lte'},
            station: {key: "receipt__order__station"},
            shift: {key: 'receipt__order__shift__shift_num'},
            cashier: {key: "receipt__order__cashier"},
            waiter: {key: 'receipt__order__serve'}
        }
    },
    geographies__area: {},
    geographies__street: {},
    licensing__location: {},
    items__department: {},
    items__custom_menu: {},
    items__base_sales_cat: {},
    items__sales_items: {},
    items__prices: {},
    stock__balance_trans: {
        filter: {
            ord_d__order__shift__date__location: station.location
        },
        keys: {
            start: {key: 'ord_d__order__shift__date__created_at__gte'},
            end: {key: 'ord_d__order__shift__date__created_at__lte'},
            station: {key: "ord_d__order__station"},
            shift: {key: 'ord_d__order__shift__shift_num'},
            cashier: {key: "ord_d__order__cashier"},
            waiter: {key: 'ord_d__order__serve'}
        }
    }
})

const settings = {
    name: 'Product Mix',
    levels: ['chain', 'chain', 'chain'],
    reduxNameList: ['items__department', 'items__custom_menu', 'items__base_sales_cat'],
    businessDay: true,
    option: true,
    salesDetails: false,
    pm: true
}

export class Report extends Component {
    // eslint-disable-next-line class-methods-use-this
    render() {
        const {station} = this.props
        return (
            <Container group_by={group_by} models_={models(station)} settings={settings} />
        )
    }
}

export default connect(state=>({
    station: get(state.licensing__station.data, state.licensing__station.active, '')
}))(Report)