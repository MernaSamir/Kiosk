import React, { Component } from 'react'
import { connect } from 'react-redux';
import classes from './../style.less'
import Card from './card';
import { map, get, find, pickBy } from 'lodash';

class Body extends Component {

    renderCards = () => {
        const { waiters, page, assigntables, assignTables, enableclick, orders, t } = this.props
        return map(waiters, (d) => {
            const order = find(orders, { serve: d.id })
            return <Card waiter={d} assigntables={assigntables} assignTables={assignTables}
                enableclick={enableclick} order={order} t={t}/>
        }).slice(4 * (page - 1), 4 * page)


    }

    render() {
        return (
            <div className={classes.body}>
                {this.renderCards()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    orders: get(state.orders__main, 'data', {}),
    waiters: pickBy(get(state.auths__user, 'data', {}), { is_waiter: true })
})

export default connect(mapStateToProps)(Body);