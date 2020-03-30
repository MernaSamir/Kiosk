import React, { Component } from 'react'
import { connect } from 'react-redux';
import { get } from 'lodash'
import classes from './../style.less';
import { withTranslation } from 'react-i18next';

class Title extends Component {
  render() {
    const { currentOrder = {}, user, mode, customer: { name = "Customer Name" } , t} = this.props

    return (
      <div className={classes.title}>
        <p className={classes.check}>
          {`${mode.name} #${currentOrder.num} - ${t("Check")} #1`}
        </p>
        <div className={classes.cust_cash}>
          <p> {`${t("Cashier")}: ${user.first_name} ${user.last_name}`}</p>
          <p id={classes.bold}>{`${t('Customer')}: ${name}`}</p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  mode: get(state.settings__mode, `data.${state.settings__mode.active}`, {}),
  currentOrder: get(get(state.orders__main, 'data', {}), state.orders__main.active, {}),
  user: get(state, 'main.current', {}),
  get customer() { return get(state.parties__customer, `data.${this.currentOrder.customer}`, {}) }
})

export default connect(mapStateToProps)(withTranslation()(Title))