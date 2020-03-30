import React, {Component} from 'react'
import { pick, range, get, omit, isEqual, defaults, find } from 'lodash'
import {connect} from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main';
import { applyPermissions } from 'helpers/permissions'
export default function WrapComponent(WrappedComponent){
    class ActionComponent extends Component {
        constructor(props) {
            super(props);
            this.getData(props)
            props.setMain("orders__details", { afterAction: this.afterAction.bind(this)})

        }
        getData = (props) => {
            const { order } = props;
            if (order) {
                this.afterFetch()
            }
        }
        datas = {};
        afterFetch = (data) => {
            const { item = {} } = this.props;
            if (item.add) {
                this.checkItem(this.props)
            }
        }
        componentWillUnmount() {
            const { setMain } = this.props;
            setMain('orders__details', { orderPopup: '' })
        }
        shouldComponentUpdate(nextProps, nextState) {
            const compare = ['item.add'];
            const su = !isEqual(pick(nextProps, compare), pick(this.props, compare));
            if(su){
                const {item={}} = nextProps;
                if (item.add && !get(this.props.item, 'add', false)) {
                    this.checkItem(nextProps)
                }
            }
            return !isEqual(pick(nextProps, ['item.add', 'list']), pick(this.props, ['item.add', 'list']));
        }

        afterAction = (data) => {
            const d = {
                active: data.parent || data.id,
                item: {
                    seat_num: data.seat_num
                },
                orderPopup: ''
            }
            return [
                { type: 'set_main_items__sales_items', data: {active: ''}},
                { type: 'set_main_orders__details', data: d},
            ]
        }
        checkItem = (props) => {
            const { list, item, setAll, field, handleChange } = props;
            
            const filters = defaults(pick(item, ['item', 'parent', 'doneness', 'parent']),
            { void: null, seat_num: 0, parent: '', doneness: null, fired_time: null })
            const mainDetail = find(list, filters) || {}

            const mainItem = {
                id: mainDetail.id,
                ...omit(item, ['add', 'onSuccess']), 
                quantity: get(mainDetail, 'quantity', 0) + 1
            }
            const data = handleChange(mainItem)

            let out = [{
                type: 'set_main_orders__details',
                data: {
                    item: {}
                }
            }, {
                type: 'set_path_form_actions',
                path: `${field.name}.active`,
                data: data.parent || data.id
            }]
            if(item.onSuccess){
                out = [...out, ...item.onSuccess(data)]
            }
            setAll([...out, ...this.afterAction(data)])
        }
        shareItem = (item) => {
            const { activeOrder, modeKey } = this.props
            const { receipts } = this.datas;
            if (item.seat_num == 0 && modeKey == 'DI') {
                return [{
                    type: 'set_main_orders__item_seats',
                    data: {
                        item: {
                            data: range(1, activeOrder.guests_num + 1).filter(i=>
                                applyPermissions({ seat_num: i }, { 'not_included_list': { key: 'seat_num', list: "receipts" } }, { receipts })
                            ).map(i => ({ seat_num: i, details: item.id })),
                            action: 'bulkAdd',
                            onSuccess: (data) => {
                                const list = data.map(i => i.seat_num)
                                return [
                                {type: 'set_path_orders__details', path: `data.${item.id}.seats`, data: list}
                                ]
                            }
                        }
                    }
                }]
            }
            return []
        }
        render() {
            const { list, field ,handleChange} = this.props
            return (
                <WrappedComponent list={list} field={field} handleChange={handleChange}/>
            )
        }
    }
    const ActionWrapedComponent = connect((state)=>({
        item: state.orders__details.item,
        order: state.orders__main.active,
        payments: state.orders__payment.data,
        activeOrder: get(state.orders__main.data, state.orders__main.active, {}),
        modeKey: get(state.settings__mode.data, `${state.settings__mode.active}.key`)
    }), mapDispatchToProps)(ActionComponent)
    return ActionWrapedComponent
}

