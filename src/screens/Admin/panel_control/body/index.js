import React, { Component } from 'react'
import classes from './../style.less'
import { map, get, filter, pick, reduce, sortBy, isEmpty } from 'lodash'
import { withRouter } from 'react-router-dom'
import applyFilters from 'helpers/functions/filters'
import analytics from 'assets/images/Admin/analytics@2x.png'
import appointment from 'assets/images/Admin/appointment@2x.png'
import cashier from 'assets/images/Admin/cashier@2x.png'
import group from 'assets/images/Admin/Group 957@2x.png'
import receipt from 'assets/images/Admin/receipt@2x.png'
import settings from 'assets/images/Admin/settings@2x.png'
import pay from 'assets/images/Admin/Group 1301@2x.png'
import transfer from 'assets/images/Admin/transfer@2x.png'
import station from 'assets/images/Admin/login@2x.png'
import safedrop from 'assets/images/Admin/Group 2643@2x.png'
// import msgcenter from 'assets/images/Admin/email@2x.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import applyFilter from 'helpers/permissions'

class Body extends Component {

  constructor(props) {
    super(props)
    this.buttons = {
      'sb': {
        DayShift: {
          img: appointment,
          authorize: ['admin_day_shift'],
          title: 'Day / Shift',
          url: 'admin/day_shift',
          index: 1
        },

        Reports: {
          img: analytics,
          authorize: ['admin_reports'],
          title: 'Reports',
          test: 's',
          url: 'admin/report',
          index: 2
        },

        Orders: {
          img: receipt,
          authorize: ['admin_orders'],
          title: 'Orders',
          url: 'admin/orders',
          index: 3
        },

        CashierFlow: {
          img: cashier,
          authorize: ['admin_cash_settlement'],
          title: 'Cash Flow',
          url: 'admin/cashier_flow',
          index: 4
        },

        // CashierSettlement: {
        //   img: cashier,
        //   authorize: ['admin_cash_settlement'],
        //   title: 'Cashier Settlement',
        //   url: 'admin/cashier_settlement',
        // index: 5 
        // },

        PayInsPayOut: {
          img: pay,
          authorize: ['admin_pays'],
          title: 'Pay Ins / Pay Outs',
          url: 'admin/pay_all',
          index: 6,
        },

        ChangeTablesWaiter: {
          img: transfer,
          title: 'Change Table Waiter',
          authorize: ['admin_change_waiter'],
          permissions: {
            mode: {
              listInclude: { key: 'key', list: "modes" }
            }
          },
          url: 'admin/change_tables_waiter',
          index: 7,
        },

        // Employees: {
        //   img: hiring,
        //   authorize: ['admin_employee'],
        //   title: 'Employees',
        // index: 8,
        // },

        POSSettings: {
          img: settings,
          title: 'POS Settings',
          authorize: ['admin_pos_settings'],
          url: 'admin/pos_settings',
          index: 9,
        },

        Floorplan: {
          img: group,
          title: 'Floorplan',
          url: 'admin/floorplan',
          authorize: ['admin_floor_plan'],
          permissions: {
            mode: {
              listInclude: { key: 'key', list: "modes" }
            }
          },
          index: 10,
        },

        Station: {
          img: station,
          title: 'Stations',
          url: 'admin/add_station',
          index: 11,
        },

        // SafeDrop: {
        //   img: safedrop,
        //   title: 'Safe Drop',
        //   url: 'admin/safe_drop',
        //  index:12,
        // },

        // MessageCenter:{
        //   img: msgcenter,
        //   title: 'Message Center',
        //   // url: 'admin/message_center',
        //index:13,
        // },

        Control: {
          img: settings,
          title: 'Stations',
          url: 'admin/control',
          index: 14
        },

        // Confirm:{
        //   icon: 'check',
        //   title: 'Waiting Confirmation',
        //   url: 'admin/confirm',
        //index:15,
        // },

        Attendance: {
          icon: 'users',
          title: 'Attendance',
          url: 'app/attendance',
          index: 16
        }
      },

      'stock': {
        Stock: {
          img: safedrop,
          title: 'Stock',
          url: 'admin/stock',
          index: 17
        },
      }
    }

  }

  state = {
    CashierSettlement: false,
  }

  componentDidMount() {
    const { getMaxPage } = this.props
    getMaxPage(Math.ceil(Object.keys(this.buttons).length / 15))
  }

  goTo = (d) => {
    const { history } = this.props;
    history.push(d.url)
  }

  renderOptions = () => {
    const { page, t, station, _location } = this.props
    let tabs =  applyFilters({
      key:"picking",
      reduxName:'licensing__location_type',
    },  _location._type)
    if(isEmpty(tabs)){
      tabs = [{key: 'sb'}]
    }
    let list = pick(this.buttons, map(tabs, d => (d.key)))
    list = reduce(list, (result, value, key) => {
      return ({ ...result, ...value })
    }, {})
    let modes = applyFilters({path:'settings__mode.data'})
     modes = pick(modes, station.modes)
    list = filter((list), applyFilter({key:'DI'}, "permissions.mode", {modes}))
    return map(sortBy(list, 'index'), (d, key) => (
      <button key={key} disabled={!applyFilters({ key: 'authorize', compare: d.authorize })} className={classes.options_btn} onClick={this.goTo.bind(this, d)}>
        {d.img ? <img src={d.img} /> :
          <FontAwesomeIcon icon={d.icon} size="4x" className={classes.icon}
            style={{ color: "#0b2a5d" }}></FontAwesomeIcon>}
        <p>{t(d.title)}</p>
      </button>
    )).slice(15 * (page - 1), 15 * page)

  }

  render() {
    return (
      <div className={classes.options_div}>
        {this.renderOptions()}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  filters: get(state.main, 'search', undefined),
  station: get(state.licensing__station.data, state.licensing__station.active),
  _location: get(state.licensing__location.data, state.licensing__location.active, {})
})
export default connect(mapStateToProps)(withRouter(Body))
