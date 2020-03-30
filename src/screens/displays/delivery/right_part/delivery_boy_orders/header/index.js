import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get, max, filter } from 'lodash'
import classes from './style.less'
import Counter from 'components/counter';

class Header extends Component {

    renderTitle = () => {
        return <div className={classes.title}>
            {this.renderDeliveryBoyName()}
            {this.renderCounter()}
        </div>
    }

    renderDeliveryBoyName = () => {
        const { user } = this.props
        return <p>{user.name}</p>
    }

    renderCounter = () => {
        const { user, orders } = this.props
        const val = filter(orders, { delivery_person: user.id })
        return <p><Counter start={max(val.map(d => d.created_at))} /></p>
    }

    render() {
        return (
            this.renderTitle()
        )
    }
}

const mapStateToProps = (state) => ({
    user: get(state.employee__employee, `data.${get(state.employee__employee, 'active', '')}`, {}),
    orders: get(state.orders__main, 'data', {})
})

export default connect(mapStateToProps)(Header)