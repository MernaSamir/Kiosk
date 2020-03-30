import React, {Component} from 'react'
import Collapse from './collapse';
import ActionComponent from './action_component'
import MainComponent from './main';
import { range } from 'lodash';
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters'
import classes from './style.less'
import {get} from 'lodash'
import { withTranslation } from 'react-i18next';

const renderHeader=(mode, t)=>{
  return <thead>
            <tr className={classes.borderBottom} >
                <th className={classes.leftPadding}>{t('Qty')}</th>
                <th >{t('Item')}</th>
                <th >{t('Size')}</th>
                <th >{mode=='TW'?t('Each'):t('Course')}</th>
                <th >{t("Total")}</th>
                <th ></th>
            </tr>
          </thead>
}
class TakeAwayClass extends Component {
  
  render() {
    const { order, receipts, t} = this.props
    return (
      <div className={classes.tableDiv}>
      <table >
        {renderHeader('TW',t)}
      <MainComponent order = {order} receipts={receipts} t={t} />
      </table>
            </div>
    )
  }
}

class DininClass extends Component {
  componentWillUnmount=()=>{
    const {setMain} = this.props
    setMain('orders__details', {item:{}})
  }
  getOrder(){
    const {order} = this.props;
    this.order = applyFilters({
      key: "GetDataSelector",
      path: 'orders__main',
      show: order
    })
  }
  renderSeats = () => {
    const { receipts, order, t } = this.props
    if(this.order.guests_num == 1){
      return <Collapse  order={order} seat_num={1} name={`Seat 1`} id={`seat${1}`} >
      <MainComponent {...this.props} receipts={receipts} order={order} seat_num= {1} t={t} />
    </Collapse>
    }
    else{
      return range(0, this.order.guests_num + 1).map(i => (
        <Collapse key={i} order={order} seat_num={i} name={i == 0 ? t("Shared Order") : `${t('Seat')} ${i}`} id={`seat${i}`} >
          <MainComponent {...this.props} receipts={receipts} order={order} seat_num= {i}  t={t}/>
        </Collapse>
      ))
    }
  }

  render() {
    const {t} = this.props

    this.getOrder()
    return (
      <div className={`${classes.tableDiv} ${classes.tableHeight} ${classes.dineIn}`}>
      <table>
        {renderHeader('DI', t)}
        {this.renderSeats()}
      </table>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  order: state.orders__main.active,
  modeKey:get(state.settings__mode,`data.${state.settings__mode.active}.key`),
  
})

export const TakeAway = ActionComponent(connect(mapStateToProps, mapDispatchToProps)( withTranslation()( TakeAwayClass )))
export const Dinin = ActionComponent(connect(mapStateToProps, mapDispatchToProps)( withTranslation () (DininClass) ))
