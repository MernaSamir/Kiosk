import React, { Component } from 'react'
import { connect } from 'react-redux';
import classes from './style.less'
import {get} from 'lodash';
import applyFilters from 'helpers/functions/filters';
import {withRouter} from 'react-router-dom';
class details extends Component {
    getMode() {
        const { mode } = this.props;
        return applyFilters({
            key: 'GetDataSelector',
            path: "settings__mode",
            show: mode
        })
    }
    render() {
        const { user, show , mode} = this.props
        return (
            <div className={classes.cashier_details}>
                <div className={classes.chashier}>
                    <p className={classes.cash_num}>Event #1</p>
                    <p className={classes.cash_name}>Agent: {`${user.first_name} ${user.last_name}`}</p>
                </div>
                 <button type="button" className={classes.customerName_btn} onClick={this.customerHandle}>
                     Guests #
                </button>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    mode: state.settings__mode.active,
    user: state.main.current,
    show: !props.history.location.pathname.includes('payment')

})
export default withRouter(connect(mapStateToProps, null, null, {pure: false})(details))
