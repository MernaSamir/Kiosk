import React, { Component } from 'react'
import Container from './../../components/container'
import {connect} from 'react-redux'
import {Message} from 'antd'
import { withTranslation } from 'react-i18next'
const group_by = {
    "model": "orders__main",
    "fun": "analysisRevenuOrders",
    levels: [
        {
            col: 'mode_id',
            type: 'main'
        },
    ]
}

const models = (bd) => ({
    orders__business_days: {
        filter: {
            id: bd
        },
    },
    orders__shifts: {
        filter: {
            date: bd
        },
        keys: {
            shift_num: {key: 'shift__shift_num'},
        }
    },
    orders__main: {
        filter: {
            shift__date: bd
        },
        keys: {
            shift: {key: 'shift__shift_num'},
            station: {key: "station"},
            cashier: {key: "cashier"},
            waiter: {key: 'serve'}
        }
    },
    orders__details: {
        filter: {
            order__shift__date: bd
        },
        keys: {
            station: {key: "order__station"},
            shift: {key: 'order__shift__shift_num'},
            cashier: {key: "order__cashier"},
            waiter: {key: 'order__serve'}
        }
    },
    orders__receipt: {
        filter: {
            order__shift__date: bd
        },
        keys: {
            station: {key: "order__station"},
            shift: {key: 'order__shift__shift_num'},
            cashier: {key: "order__cashier"},
            waiter: {key: 'order__serve'}
        }
    },
    orders__payment: {
        filter: {
            order__shift__date: bd
        },
        keys: {
            station: {key: "order__station"},
            shift: {key: 'order__shift__shift_num'},
            cashier: {key: "order__cashier"},
            waiter: {key: 'order__serve'}
        }
    },
    orders__receipt_items: {
        filter: {
            receipt__order__shift__date: bd
        },
        keys: {
            station: {key: "receipt__order__station"},
            shift: {key: 'receipt__order__shift__shift_num'},
            cashier: {key: "receipt__order__cashier"},
            waiter: {key: 'receipt__order__serve'}
        }
    },
    geographies__area: {},
    geographies__street: {},
    licensing__location: {}
})

const settings = {
    name: 'X-Report',
    levels:['modes'],
    generateAtStart: true,
    businessDay: false,
    option: true,
    salesDetails: true,
    details: {
        other_mode: {
            title: 'Order Modes',
            fileds: {
                Receipts: {
                    key: "Receipts",
                    value: 'totals.lengths.receipts'
                },
                Sales: {
                    key: "Grand Sales",
                    value: 'totals.orders.totals.grant'
                }
            },
            data_path: 'data.childs',
            reduxName: 'settings__mode'
        },
     payment_detail: {
            title: 'Payment Details',
            fileds: {
                Total: {
                    key: "Total",
                    value: 'totals.orders.totals.paid'
                }
            },
            data_path: 'data.totals.orders.totals.paid',
            reduxName: 'payment__types'
        }
    }
}

export class Report extends Component {
    constructor(props){
        super(props)
        if(!props.bd){
            Message.warn(props.t("no Active Business Day"))
        }
    }
    render() {
        const {bd} = this.props
        return (
            <Container group_by={group_by} models_={models(bd||null)} settings={settings} />
        )
    }
}

export default connect(state=>({
    bd: state.orders__business_days.active
}))(withTranslation()(Report))