import React, { Component } from 'react'
import classes from './styles.less';
import Header from './components/header';
import Table from './components/table';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get , filter } from 'lodash';
import applyFilters from 'helpers/functions/filters';
import RenderdropDown from 'helpers/functions/drop_down'
import SelectRow from 'components/select_row'
import Edit from 'components/edit_action'
import Delete from 'components/recycle_bin'
import Note from 'components/note'
import { Route } from 'react-router-dom'
import valFun from 'helpers/functions/show'

var DeliveryTable = (row = {}, setMain) => (
  [
    { head: '', Component: <SelectRow row={row} onClick='' />, class: classes.empty },
    {
      head: 'Customer Name', class: classes.name,view:'customer_name'
      // Component: <RenderdropDown appName="parties__customer" show="name"
      //   filter={[row.customer]} filterKey='id' type='dropDown' />,
    },
    // {
    //   head: 'Address', class: classes.name,
    //   // Component: <RenderdropDown appName="parties__address" show="address"
    //   //   filter={[row.address]} filterKey='id' type='dropDown' />,
    // },
    { head: 'Phone', view: 'mobile', class: classes.phone},
    { head: 'Balance', view: 'deposite', class: classes.table },
    { head: 'Date',Component:valFun({type: 'date', non_default:true},row.date), class: classes.date },
    { head: 'Hour', Component:valFun({type: 'hour',non_default:true},row.from_hour), class: classes.table },
    { head: 'Edit', Component: <Edit onClick="EditCatring" item={row} />, class: classes.note },
    { head: 'Pay', Component: <Note reservation={row} />, class: classes.note },
    {
      head: 'Cancel', Component: <Delete item={row} onClick="Delete"
        reduxName='parties__reservation' title='Delete Reservation' singleitem='Reservation' />,
      class: classes.note
    },


  ])
var PickupTable = (row = {}, setMain) => (
  [
    { head: '', Component: <SelectRow row={row} onClick='' />, class: classes.empty },
    {
      head: 'Customer Name', class: classes.name,view:'customer_name'
      // Component: <RenderdropDown appName="parties__customer" show="name"
      //   filter={[row.customer]} filterKey='id' type='dropDown' />,
    },
    // {
    //   head: 'Address', class: classes.name,
    //   // Component: <RenderdropDown appName="parties__address" show="address"
    //   //   filter={[row.address]} filterKey='id' type='dropDown' />,
    // },
    { head: 'Phone', view: 'mobile', class: classes.phone},
    { head: 'Balance', view: 'deposite', class: classes.table },
    { head: 'Date',Component:valFun({type: 'date', non_default:true},row.date), class: classes.date },
    { head: 'Hour', Component:valFun({type: 'hour',non_default:true},row.from_hour), class: classes.table },
    { head: 'Edit', Component: <Edit onClick="EditCatring" item={row} />, class: classes.note },
    { head: 'Note', Component: <Note reservation={row} />, class: classes.note },
    {
      head: 'Cancel', Component: <Delete item={row} onClick="Delete"
        reduxName='parties__reservation' title='Delete Catring' singleitem='Reservation' />,
      class: classes.note
    },

  ])
class OrderStatus extends Component {
  state = {
    activeTab: 0,
    page: 1,
  }


  activeHeader = (activeTab, d) => {
    const { history, setMain } = this.props
    setMain("settings__sub_mode", { active: d.id })

    this.setState({
      activeTab
    })
    if (d.key=='delivery') {
      history.push('/catring_list/delivery')
    }
    else
      history.push('/catring_list/pickup')

  }

  handelPagination = (delta) => {
    const { page } = this.state
    this.setState({ page: page + delta })
  }

  render() {
    const { page, activeTab } = this.state
    const { mode, match, subMode } = this.props
    const CateringOrders = applyFilters({
      key: 'Filter',
      path: "parties__reservation",
      params: {
        _type: 'cat'
      }
    })

    const maxlength = Math.ceil(CateringOrders.length / 10)
    return (
      <>
        <div >
          <Header page={page}
            maxlength={maxlength}
            handelPagination={this.handelPagination}
            activeHeader={this.activeHeader}
            activeTab={activeTab}
            mode={mode}
          />
        </div>
        <Route path={`${match.url}/delivery`} render={() => <Table list={CateringOrders} page={page} Table={DeliveryTable} />} />
        <Route path={`${match.url}/pickup`} render={() => <Table list={CateringOrders} page={page} Table={PickupTable} />} />
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  mode: get(state.settings__mode, `data.${get(state.settings__mode, 'active')}`, {}),
  subMode: get(state.settings__sub_mode, `data.${get(state.settings__sub_mode, 'active')}`, {}),
  data : filter(state.parties__reservation.data, { _type: 'cat' }),
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderStatus)