import { Component } from 'react'
import {isEqual} from 'lodash'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
// import applyFilter from 'helpers/filters/main'
import { withRouter } from 'react-router-dom'
import { Modes as urls } from 'config';
import { get, map } from 'lodash';
import applyFilter from 'helpers/functions/filters'

class end_order extends Component {
    constructor(props) {
        // debugger
        super(props);
        this.checkOrder(props)
    }
    checkOrder(nextProps) {
        if (nextProps.calc && !nextProps.calc.open_receipt && nextProps.calc.receipts.length && nextProps.calc.balance_due <= 0.02) {
            const { setMain, order } = this.props;
            setMain("orders__main", {
                item: {
                    end_time: new Date(),
                    id: order,
                    onSuccess: this.afterOrderUpdate,
                    action: 'update',                
                }
            })
        }
    }
    afterOrderUpdate = (order) => {
        const { history, mode } = this.props;
        let dis = [
            { type: 'set_main_orders__main', data: { active: '' } },
            { type: 'set_main_items__custom_menu', data: { active: '' } },
            { type: 'set_main_items__base_sales_cat', data: {active: ''} }
        ];
        const data = applyFilter({
            key: 'multiApply',
            apps: {
                orders__main: {
                    key: 'Filter',
                    path: "orders__main",
                    params: {
                        id: order.id
                    }
                },
                orders__details: {
                    key: 'Filter',
                    path: 'orders__details',
                    params: {
                        order: order.id
                    }
                },
                orders__receipt: {
                    key: 'Filter',
                    path: 'orders__receipt',
                    params: {
                        order: order.id
                    }
                },
                orders__receipt_items: {
                    key: 'ListInside',
                    path: 'orders__receipt_items',
                    compare: order.id,
                    select: 'order',
                    selectors: {
                        orders__details: 'details'
                    }
                },
                orders__orders_discount: {
                    key: "Filter",
                    path: "orders__orders_discount",
                    params: {
                        order: order.id
                    }
                },
                orders__payment: {
                    key: 'Filter',
                    path: 'orders__payment',
                    params: {
                        order: order.id
                    }
                },
            }
        })
        // data contains all orders data to update the gun
        const gunDB = applyFilter({path:'guns.hq'})
        if(gunDB){
            const hq_gun = gunDB.get('hq')
            map(data, (app_data, app_name) => {
                map(app_data, single_app_data => {
                    const gun_data = {[get(single_app_data,'id')]: JSON.stringify(single_app_data)}
                    hq_gun.put({[app_name] : gun_data})
                })
            })
        }


        if (order.table) {
            dis.push({ type: 'set_main_dinin__tables', data: { active: '' } })
            dis.push({ type: 'set_path_dinin__tables', path: `data.${order.table}.active`, data: null })
        }
        history.push(urls[mode.key])
        return dis;
    }
    shouldComponentUpdate(nextProps, ...inputs) {
        this.checkOrder(nextProps, ...inputs)
        return !isEqual(this.props, nextProps);
    }
    render() {
        return (
            this.props.children
        )
    }
}
export default withRouter(connect((state, props)=>({
    order: props.order || state.orders__main.active,
    mode: get(state.settings__mode.data, props.mode || state.settings__mode.active, {})
}), mapDispatchToProps)(end_order))
