import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import {get, isEqual, pick} from 'lodash'
import { map } from 'lodash';
import OrderRow from './order_row';
import applyFilters from 'helpers/functions/filters'

class Orders extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['item', 'active', 'data', 'receipts']
        return !isEqual(pick(this.props, compare), pick(nextProps, compare))
    }

    renderBillItems = () => {
        const list = this.getList()
        // console.log('list', list)
        const { modeKey, receipts, t } = this.props;
        return map(list,(detail, index) => {
            return <OrderRow key={index} receipts={receipts} splitCheck={false}
              detail={detail.id} modeKey={modeKey} t={t}/>
        })
    }
    
    getList(){
        const {filter} = this.props;
        return applyFilters({
            key: "Filter",
            path: 'orders__details',
            params: {
                parent: null,
                ...filter
            },
            then: {
                key: 'Reject',
                params: {
                    deleted: true
                }
            }
        })
    }

    render() {
        return (
            <tbody>
                {this.renderBillItems()}
            </tbody>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        filter: {
            seat_num: ownProps.seat_num || 0,
            order: ownProps.order
        },
        item: state.orders__details.item,
        active: state.orders__details.active,
        modeKey: get(state.settings__mode,`data.${state.settings__mode.active}.key`),
        data:state.orders__details.data
    }
}


export default withRouter(connect(mapStateToProps)(Orders))

