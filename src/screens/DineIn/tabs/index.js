import React, { Component } from 'react'
import {connect}  from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './style.less'
import Tab from './tab'
import Header from './header'
import {get, keys}  from 'lodash'
import applyFilters from 'helpers/functions/filters'
import {withRouter} from 'react-router-dom'
import {message} from 'antd';
import moment from 'moment'


class Tabs extends Component {
    state = {
        page: 1
    }
    getOrders=()=>{
        const {zone} = this.props
        return applyFilters({
            key: 'Filter',
            path:'orders__main',
            params:{
                sub_mode: zone.sub_mode,
                end_time: null
            }
        })
    }
    renderTabs=()=>{
        const {page} = this.state
        const orders = this.getOrders()
        return <>
            <Tab type={'add'} onClick={this.addNewTab}/>
            {orders.map((d, idx)=>(
                <Tab key={idx} order={d} onClick={this.activeOrder}/>
            )).slice(39 * (page - 1), 39 * page) }
           
        </>
   
    }
    addNewTab=()=>{
        const {setMain, zone, business_day} = this.props
        if(moment().diff(moment(business_day.created_at), 'day') == 0){
            const data = applyFilters({
                key: 'mapSelect',
                select: {
                    serve: 'main.current.id',
                    mode: 'settings__mode.active',
                    shift: 'orders__shifts.active',
                    station: 'licensing__station.active',
                }
            })
            const order = {
                ...data,
                start_time: new Date(),
                sub_mode: zone.sub_mode,
                guests_num: 1
            }
            setMain('orders__main',{ item: {...order, action:'add',onSuccess:this.openOrder } })
        }
        else{
            message.warning('You Cannot Order in this business day please end Day First')
        }
    }
        openOrder=(order)=>{
            const {history} = this.props
            history.push('/home')
            return [
            {type: 'set_main_orders__main', data: {active: order.id}},
            {type: 'set_main_orders__details', data: {item:{seat_num:1}}},
            ]
        }
    activeOrder=(order)=>{
        const {history, setAll} = this.props
        history.push('/home')
        setAll([
            {type: 'set_main_orders__main', data: {active: order.id}},
            {type: 'set_main_orders__details', data: {item:{seat_num:1}}},
            ])
    }
    handelPageClick = (op) => {
        const { page } = this.state
        const  orders  = this.getOrders()
        let pageMax = Math.ceil((keys(orders) || []).length / 39)
        if (!(page <= 1 && op == -1) && !(page >= pageMax && op == 1)) {
            this.setState({ page: page + op })
        }
    }

  render() {
    const orders  = this.getOrders()
    const { page } = this.state
    let pageMax = Math.ceil((keys(orders) || []).length / 39)
    return (
      <div className={classes.container}>
        <Header
            page={page}
            pageMax={pageMax}
            handelPageClick={this.handelPageClick} />
        <div className={classes.tabs}>
            {this.renderTabs()}
            
        </div>
      </div>
    )
  }
}
const mapStateToProps =(state)=>({
    zone: get(state.dinin__zones.data, state.dinin__zones.active, ''),
    orders: state.orders__main.data,
    business_day: get(state.orders__business_days.data,state.orders__business_days.active, '' )
})
export default connect(mapStateToProps, mapDispatchToProps)( withRouter(Tabs) )