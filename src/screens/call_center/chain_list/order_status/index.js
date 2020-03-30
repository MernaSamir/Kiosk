import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters';
import { Route } from 'react-router-dom'
import { get } from 'lodash';
import Header from './components/header';
import Table from './components/table';
import RenderdropDown from 'helpers/functions/drop_down'
import Actions from './actions'
import SelectRow from 'components/select_row'
import classes from './styles.less';
import Clock from 'helpers/components/clock'
import { Cal_Order } from 'components/order_value'

var DeliveryTable = (row = {}, status, fun) => (
  [
    { head: '', Component: <SelectRow row={row} onClick='activeOrder' />, class: classes.empty },

    {
      head: 'Customer', class: classes.name,
      Component: <RenderdropDown appName="parties__customer" show="name"
        filter={[row.customer]} filterKey='id' />,
    },
    {
      head: 'DSP', class: classes.name,
      Component: <RenderdropDown appName="delivery_service" show="name"
        filter={[row.sp]} filterKey='id' type='dropDown' />,
    },
    {
      head: 'Ref Loc', class: classes.name,
      Component: <RenderdropDown appName="licensing__location" show="full_name"
        filter={[row.served_location]} filterKey='id' type='dropDown' />,
    },
    {
      head: 'Address', class: classes.name,
      Component: <RenderdropDown appName="parties__address" show="address"
        filter={[row.address]} filterKey='id' />,
    },

    {
      head: 'Phone', Component: <RenderdropDown appName="parties__customer_contacts" show="contact"
        filter={[row.customer]} type='dropDown' filterKey='customer' />, class: classes.phone
    },

    { head: 'Time', Component: <Clock format="HH:mm" select={row} fun={fun} />, class: classes.date },

    { head: 'Value', Component: <Cal_Order order={row} />, class: classes.table },

    { head: 'Status', class: classes.date, Component: <button className={classes.normal}>{status}</button> },

    {
      head: 'Action', class: classes.icons,
      Component: <Actions className={classes.actions} order={row} />,
    }
  ])

var PickupTable = (row = {}, status, fun) => (
  [
    { head: '', Component: <SelectRow row={row} onClick='activeOrder' />, class: classes.empty },
    {
      head: 'Customer', class: classes.name,
      Component: <RenderdropDown appName="parties__customer" show="name"
        filter={[row.customer]} filterKey='id' />,
    },
    {
      head: 'DSP', class: classes.name,
      Component: <RenderdropDown appName="delivery_service" show="name"
        filter={[row.sp]} filterKey='id' type='dropDown' />,
    },
    {
      head: 'Address', class: classes.name,
      Component: <RenderdropDown appName="licensing__location" show="name"
        filter={[row.pick_location]} filterKey='id' />,
    },
    {
      head: 'Phone', Component: <RenderdropDown appName="parties__customer_contacts" show="contact"
        filter={[row.customer]} type='dropDown' filterKey='customer' />, class: classes.phone
    },
    { head: 'Time', Component: <Clock format="HH:mm" select={row} fun={fun} />, class: classes.date },

    { head: 'Value', Component: <Cal_Order order={row} />, class: classes.table },

    {
      head: 'Status', class: classes.date,
      Component: <button className={classes.normal}>{status}</button>
    },

    {
      head: 'View', class: classes.icons,
      Component: <Actions className={classes.actions} order={row} />,
    }
  ])

class OrderStatus extends Component {

  constructor(props) {
    super(props);
    if(props.HQGun){
      props.HQGun.get('orders__main').put(null)
    }
  }

  state = {
    page: 1,
  }


  componentWillUnmount = () => {
    const { setMain } = this.props
    setMain('main', { search: '' })
  }

  componentDidMount() {
    this.first()
  }

  first() {
    const { mode, history, setMain } = this.props
    const tabs = applyFilters({
      key: 'Filter',
      path: "settings__sub_mode",
      params: {
        mode: mode.id,
      }
    })
    setMain('settings__sub_mode', { active: tabs[0].id })
    history.push(`/call_center_list/${tabs[0].key}`)
  }

  handelPagination = (delta) => {
    const { page } = this.state
    this.setState({ page: page + delta })
  }

  filters = {
    pickup: {
      key: 'Reject',
      params: {
        pick_location: null
      }
    },
    delivery: {
      key: 'Reject',
      params: {
        address: null
      }
    },
  }

  render() {
    const { page } = this.state
    const { mode, match, subMode, filters } = this.props
    const then = get(this.filters, subMode.key)
    let CallCenterList = applyFilters({
      key: 'Filter',
      path: "orders__main",
      params: {
        mode: mode.id,
        // served_location: current_location,
        end_time: null
      },
      then
    })
    CallCenterList = filters ? applyFilters({
      key: 'deepSearch',
      value: filters,
      search: {
        key: 'oring',
        list: true,
        funs: {
          customer: {
            key: 'chain',
            selectors: {
              parties__customer: 'customer'
            },
            display: 'name'
          },
          address: {
            key: 'storeFilter',
            d_path: 'parties__address.data',
            params: {
              customer: 'customer'
            },
            then: {
              key: 'dataPick',
              select: 'name'
            }
          },
          contacts: {
            key: 'storeFilter',
            d_path: 'parties__customer_contacts.data',
            params: {
              customer: 'customer'
            },
            then: {
              key: 'dataPick',
              select: 'contact'
            }
          }
        }
      }

    }, CallCenterList) : CallCenterList
    const maxlength = Math.ceil(CallCenterList.length / 11)
    // console.log("CALL CENET ", CallCenterList)
    return (
      <>
        <div >
          <Header page={page}
            maxlength={maxlength}
            handelPagination={this.handelPagination}
            mode={mode}
          />
        </div>
        <Route path={`${match.url}/delivery`} render={() =>
          <Table list={CallCenterList} page={page} Table={DeliveryTable} />} />
        <Route path={`${match.url}/pickup`} render={() =>
          <Table list={CallCenterList} page={page} Table={PickupTable} />} />
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  data: get(state.orders__main, 'data', {}),
  mode: get(state.settings__mode.data, state.settings__mode.active, {}),
  subMode: get(state.settings__sub_mode.data, state.settings__sub_mode.active, {}),
  station: state.licensing__station.active,
  current_location: state.licensing__location.active,
  filters: get(state.main, 'search', false),
  HQGun: get(state.guns, 'hq')
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderStatus)