import React, { Component } from 'react'
import { get, map, range, find} from 'lodash';
import Check from './check'
// import SharedOrder from './check/shared_order'
import { connect } from 'react-redux'
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main'

class Checks extends Component {

    renderChecks=()=> {
        const {order, page, setAll, receipts} = this.props
        const seats = range(0,order.guests_num+1).map(i=>i)
        
        return map(seats, (seat, key) => {
            const receipt = find(receipts,d=>d.order==order.id&&d.seats.includes(seat))
            return <Check seat = {seat} order={order} key={key} setAll={setAll} receipt={receipt} />
        }).slice(3 * (page - 1), 3 * page) 
    }

    render() {
        return (
            <div className={classes.container}>
                {this.renderChecks()}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    order: get(state, `orders__main.data.${state.orders__main.active}`, {}),
    receipts: state.orders__receipt.data
})


export default connect(mapStateToProps, mapDispatchToProps)(Checks)
