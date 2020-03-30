import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get, keys, isEqual, includes , filter, isEmpty} from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import moment from 'moment'
import classes from './style.less'
import Header from './header'
import OrderTable from './table'
import applyFilters from 'helpers/functions/filters';
import { multiRequest } from 'helpers'



const getApps = (days) => {
    return {
        orders__main: { filter: { shift__date__in: days} },
        orders__details: { filter: { order__shift__date__in: days } },
        orders__payment: { filter: { order__shift__date__in: days } },
        orders__receipt: { filter : { order__shift__date__in: days} },
        orders__receipt_items: { filter: { receipt__order__shift__date__in: days } },
    }
}
class AdminOrderList extends Component {
    

    state = {
        page: 1
    }
    shouldComponentUpdate(nextProps, nextState) {
        const su = !moment(nextProps.date.start).isSame(this.props.date.start, 'day') ||
         !moment(nextProps.date.end).isSame(this.props.date.end, 'day') || !isEqual(nextProps.filters, this.props.filters)
        if(su){
            this.getData(nextProps)
        }
        return su || !isEqual(this.state, nextState)
      }
      componentDidMount() {
         this.getData(this.props)
      }
      getData = (props)=>{
        const days = applyFilters({
            key: 'DateBetween',
            path: 'orders__business_days',
            compare: 'start_time',
            date: props.date
        }).map(d=>(d.id))
        multiRequest(getApps(days)).then(d=>{
            this.setState({loading: !this.state.loading})
        })
      }
     
      


  
    getOrders=()=>{
        const { date, filters } = this.props;
        const days = applyFilters({
            key: 'DateBetween',
            path: 'orders__business_days',
            compare: 'start_time',
            date
        })
        const dayShifts = applyFilters({
            key: 'Includes',
            path: 'orders__shifts',
            pick: 'id',
            select: 'date'
        }, undefined, undefined, {data: days})

        let shiftOrders = applyFilters({
            key: 'Includes',
            path: 'orders__main',
            pick: 'id',
            select: 'shift',
            then:{
                key:'Reject',
                params:{
                    end_time:null
                }
            }
        }, undefined, undefined, {data: dayShifts})
        let receipts = applyFilters({
            key: 'Includes',
            path: 'orders__receipt',
            pick: 'id',
            select: 'order',
            
        }, undefined, undefined, {data: shiftOrders})
        if(!isEmpty(filters)){
            shiftOrders = shiftOrders.filter(o=> ( includes(o.number.toString(),filters) ) ||
            filter(receipts,{order: o.id}).filter(r=>includes(r.invoice, filters) ||
             includes(r.number, filters) ).length )
        }
        return shiftOrders
    }

    handelPageClick = (op) => {
        const { page } = this.state
        const  orders  = this.getOrders()
        let pageMax = Math.ceil((keys(orders) || []).length / 8)
        if (!(page <= 1 && op == -1) && !(page >= pageMax && op == 1)) {
            this.setState({ page: page + op })
        }
    }


    render() {

        const orders  = this.getOrders()
        const { page } = this.state
        const {t} =  this.props
        let pageMax = Math.ceil((keys(orders) || []).length / 8)
        return (
            <div className={classes.container}>
                <Header
                    page={page}
                    pageMax={pageMax}
                    handelPageClick={this.handelPageClick}
                    t={t}
                />

                <OrderTable page={page} orders={orders} t={t}/>


            </div>
        )
    }
}



const mapStateToProps = (state, props) => {
    return {
        date: get(state, 'orders__main.filter.date', { start: moment().subtract(1, 'day'), get end() { return moment() } }),
        filters: get(state.orders__main, 'filters', undefined)
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(AdminOrderList)
