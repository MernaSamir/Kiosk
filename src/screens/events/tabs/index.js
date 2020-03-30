import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get, map, keys } from 'lodash'
import classes from './style.less'
import Header from './header'
import Tab from './tab'
import applyFilters from 'helpers/functions/filters';
import moment from 'moment'
class Tabs extends Component {
  state = {
    page: 1,
    type: ''
  }
  handelPageClick = (op) => {
    const { page } = this.state
    const guests = this.getTabs()
    let pageMax = Math.ceil((keys(guests) || []).length / 40)
    if (!(page <= 1 && op == -1) && !(page >= pageMax && op == 1)) {
      this.setState({ page: page + op })
    }
  }
  addNewTab = () => {
    const { setMain } = this.props
    const { activeData } = this.props
    setMain('parties__event_tab', { item: { reservation: activeData.id, action: 'add', onSuccess: this.openTab } })
  }
  activeTab = (Tab) => {
    const { history, activeData } = this.props
    if (activeData.lacarte_type == 'multi' && Tab.paid == 0) {
      const { setMain } = this.props
      const popup = {
        type: 'EnterNum', visable: true, width: "50%",
        childProps: {
          activeEvent: activeData,
          Title: 'Payment'
          
      }
      }

      setMain('popup', { popup })
    }
    else {
      history.push('/home')
    }


    // setAll([
    //     {type: 'set_main_orders__main', data: {active: order.id}},
    //     {type: 'set_main_orders__details', data: {item:{seat_num:1}}},
    //     ])
  }
  openTab = (Tab) => {
    const { history } = this.props
    history.push('/home')
    // return [
    // {type: 'set_main_orders__main', data: {active: order.id}},
    // {type: 'set_main_orders__details', data: {item:{seat_num:1}}},
    // ]
  }

  // if(moment().diff(moment(business_day.created_at), 'day') == 0){
  //     const data = applyFilters({
  //         key: 'mapSelect',
  //         select: {
  //             serve: 'main.current.id',
  //             mode: 'settings__mode.active',
  //             shift: 'orders__shifts.active',
  //             station: 'licensing__station.active',
  //         }
  //     })
  //     const order = {
  //         ...data,
  //         start_time: new Date(),
  //         guests_num: 1
  //     }
  //     setMain('orders__main',{ item: {...order, action:'add',onSuccess:this.openOrder } })
  // }
  renderTabs = (activeData) => {

    const { page } = this.state
    const guests = this.getTabs()
    if (activeData.lacarte_type == 'one') {
      return <><Tab type={'add'} onClick={this.addNewTab} />
        {map(guests, (d, idx) => {
          return <Tab index={idx + 1} guest={d} onClick={this.activeTab.bind(this, d)} />
        }).slice(40 * (page - 1), 40 * page)}
      </>
    }
    else {
      return map(guests, (d, idx) =>
        (<Tab index={idx + 1} guest={d} onClick={this.activeTab.bind(this, d)} />
        )).slice(40 * (page - 1), 40 * page)
    }
  }
  getTabs = () => {
    const { activeData } = this.props
    return applyFilters({
      key: 'Filter',
      path: "parties__event_tab",
      params: {
        reservation: activeData.id,
      }
    })

  }
  render() {
    const guests = this.getTabs()

    let pageMax = Math.ceil((keys(guests) || []).length / 40)
    const { page } = this.state
    const { activeData } = this.props
    return (
      <div className={classes.container}>
        <Header reservation={activeData.id}
          page={page}
          pageMax={pageMax}
          handelPageClick={this.handelPageClick} />
        <div className={classes.tabs}>
          {this.renderTabs(activeData)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  activeData: get(state.parties__reservation.data, state.parties__reservation.active, {}),
  tabs: get(state.parties__event_tab, "item.action")

})


export default connect(mapStateToProps, mapDispatchToProps)(Tabs)

