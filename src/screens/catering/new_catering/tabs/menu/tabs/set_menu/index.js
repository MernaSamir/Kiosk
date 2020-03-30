import React, { Component } from 'react'
import classes from '../style.less'
import mapDispatchToProps from 'helpers/actions/main';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
// import Render from 'helpers/functions/field_mapper/renderfields'
import { withTranslation } from 'react-i18next';
import { message } from "antd"
import moment from "moment"
import applyFilters from 'helpers/functions/filters';
import { get } from "lodash"
class setMenu extends Component {
  addMenu = () => {
    const { setMain, values, order, history, business_day } = this.props
    console.log(values,"hereeeeeeee")

    setMain("form", { event: {values} })
    if (!order) {
      // if (moment().diff(moment(business_day.created_at), 'day') == 0) {
        let data = applyFilters({
          key: 'mapSelect',
          select: {
            serve: 'main.current.id',
            mode: 'settings__mode.active',
            shift: 'orders__shifts.active',
            station: 'licensing__station.active',
          }
        })
        data = {...data , _type: 'cat'}

        setMain('orders__main', {
          item: {
            ...data, action: 'add',
            onSuccess: this.goHome

          }
        })
      // }
      // else {
      //   message.warning('You Cannot Order in this business day please end Day First')
      // }
    }
    else {
      history.push('/home')

    }

  }
  goHome = (order) => {
    const { setMain,  history,  } = this.props
  setMain("orders__main",{active:order.id})
    history.push('/home')
    return []
  }
  render() {
    const { t } = this.props
    return (
      <div className={classes.container}>
         {/* <p className={classes.p}>{t("The order doesn’t have added products")} </p> */}
        <button className={classes.startBtn} type='button' onClick={this.addMenu}>{t("Add products")}</button>

      </div>
    )
  }
}
const mapStateToProps = state => ({
  order: state.orders__main.active,
  business_day: get(state.orders__business_days.data, state.orders__business_days.active, {}),


});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTranslation()(setMenu)))
