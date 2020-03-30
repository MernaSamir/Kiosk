import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import applyFilters from 'helpers/functions/filters'
import Performace from 'helpers/components/performance';
import { Modes as urls } from 'config'
import { activeModes } from 'config'
import { withRouter } from 'react-router-dom'
import { get, pick, toArray, lowerCase, isEmpty } from 'lodash'
import Dropdown from 'components/dropdown'
import classes from './../style.less';

class modes extends Component {

  setCurrentMood = (active, mode) => {
    const { setAll, history, active: mainActive } = this.props;
    const url = get(urls, mode.key)
    let dis = [
      { type: 'set_main', app: 'settings__mode', data: { active } },
      { type: 'set_main', app: 'orders__details', data: { item: {} } },
      { type: 'set_main', app: 'Printing', data: { print: {} } },
      { type: 'set_main', app: 'main', data: { search: '' } },
    ]
    // if (mode.key != 'TW') {
    dis.push({ type: 'set_main', app: 'orders__main', data: { active: '' } })
    // }
    setAll(dis)
    // debugger
    if (history.pathname != url) {
      //localStorage.setItem('mode', active)
      history.push(url)
    }
  }
  constructor(props) {
    super(props);
    this.list = applyFilters({ key: 'picking', path: 'settings__mode' }, undefined, undefined, { data: props.station.modes })
  }

  render() {
    const { business_day, list, active, order, station, t, history } = this.props;
    const mode = get(list, active, {});
    let mainList = toArray(pick(list, station.modes));
    mainList = mainList.map(d=>({...d, authorize : [lowerCase(d.key)] } ) ).filter(d=>applyFilters({key: 'authorize', compare: d.authorize}))
    if (business_day && mainList.length && activeModes.includes(station._type)) {
      return (
        <Dropdown data={mainList}
          btnClass={classes.header_btn}
          clickedclass={classes.header_btn_active}
          onChange={this.setCurrentMood}
          value={active}
          disabled={order && (mode.key == 'TW' || mode.key == 'CC' || mode.key == 'DL') && history.location.pathname != "/admin/admin_orders" ? true : false}
        >
          {t("Mode")}:
         </Dropdown>
      )
    } else {
      return <div></div>
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    station: get(state.licensing__station.data, state.licensing__station.active),
    list: state.settings__mode.data,
    active: state.settings__mode.active,
    business_day: state.orders__business_days.active,
    order: state.orders__main.active,
    activeOrder: get(state.orders__main.data, state.orders__main.active, {})
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Performace(modes, ['business_day', 'list', 'active', 'order'])))