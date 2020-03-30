import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, head } from 'lodash';
import mapDispatchToProps from 'helpers/actions/main';
import { withRouter } from 'react-router-dom';
import classes from './style.less'
import applyFilters from 'helpers/functions/filters';
import { message } from 'antd';
import {withTranslation} from 'react-i18next'

class CallCenterPay extends Component {

  calculateBill = (receipt) => {
    const orderDetails = applyFilters({
      key: 'Filter',
      path: 'orders__details',
      params: {
        order: receipt.order
      }
    })
    const calc = applyFilters({
      key: 'calculateReceipts',
      path: 'orders__receipt',
    }, orderDetails, undefined, { receipt: receipt.id, seatsNum: receipt.seats })
    // console.log(calc)
    return head(calc).net_total == receipt.net_total
  }

  pay = (d) => {
    const { setMain, history , t } = this.props;
    const pay = this.calculateBill(d)
    if (pay) {
      setMain("orders__receipt", { active: d.id });
      this.props.onCancel()
      history.push('/Home/payment');
    }
    else {
      message.warning(t('You Have To Reprint'))
    }
  }

  renderButtons() {
    const list = applyFilters({
      key: 'List',
      path: "orders__receipt",
      select: {
        order: 'orders__main.active',
        invoice: null,
        _type: 'F'
      }
    })
    if (!isEmpty(list)) {
      // console.log(list)
      return list.map((d, i) => (
        this.pay(d)
      ))
    }
    else {
      return <div className={classes.noActive}>{t("No Active Receipt to Pay")}</div>
    }
  }

  render() {
    return (
      <div className={classes.btnsContanier}>
        {this.renderButtons()}
      </div>
    );
  }
}

export default withRouter(connect(null, mapDispatchToProps)(withTranslation()(CallCenterPay)))
