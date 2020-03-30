import React, { Component } from 'react'
import { get} from 'lodash'
import { connect } from 'react-redux';
import moment from 'moment'
import classes from '../style.less';

class ReceiptHeader extends Component {
    render() {
        const { order, table, translate , mode, waiter, printer} = this.props
        return (
            <div className={classes.headerCon}>
                <h1>{printer}</h1>
                <div>
                    <section>
                        <div><p>{`${translate("Order")}   ${order.num || ''}`}</p></div>
                        <div><p>{`${translate("Time")}   ${moment().format('hh:mm')}`}</p></div>
                        <div><p>{mode.key=='DI'&&`${translate("Table")}   ${table.name || ''}`}</p></div>
                    </section>
                    <section>
                        <div><p>{mode.key=='DI'&&`${translate("Waiter")}   ${waiter.name || ""}`}</p></div>
                        <div><p>{mode.key=='DI'&&`${translate("Guests")}   ${order.guests_num || 1}`}</p></div>
                        <div><p>{`${translate("Mode")}   ${translate(mode.name || "")}`}</p></div>
                    </section>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    mode: get(state.settings__mode.data, props.order.mode, {}),
    table:get(state.dinin__tables.data, props.order.table, {}),
    waiter : get(state.users.data , props.order.serve,{})
})

export default connect(mapStateToProps, null)(ReceiptHeader)

