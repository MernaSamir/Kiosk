import React, { Component } from 'react'
import { connect } from 'react-redux'
import { map, get, isEqual,pick, head, sortBy } from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import Table_header from './table_header'
import Order_row from './order_row'
import moment from 'moment'
import classes from './style.less';
import applyFilters from 'helpers/functions/filters';

class Table extends Component {
    componentDidMount=()=>{
      this.setActive()
    }
    componentDidUpdate=(prevProps)=>{
        const {orders} = this.props
        if(!isEqual(orders, prevProps.orders)){
            this.setActive()
        }
    }
    setActive=()=>{
        const {setMain, orders} = this.props
        setMain('orders__main',{active:get( head(orders), 'id', '' )})
        const receipts = applyFilters({
            key:'Filter',
            path:'orders__receipt',
            params:{
                order:get( head(orders), 'id', '' )
            }
        })
        setMain('orders__receipt', {active:get( head(receipts), 'id', '' )})
    }
 
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ["orders",'order','page']
        return !isEqual(pick(this.props, compare), pick(nextProps, compare))
      }
    renderOrders = () => {

        const { orders, page} = this.props
        sortBy(orders, 'num')
        return map(orders, (o, idx) => {
            return <Order_row order={o} idx={idx}/>
        }).slice(8 * (page - 1), 8 * page)
    }

    render() {
        const {t} =  this.props

        return (
            <div className={classes.ordersList}>
                <table >
                    <Table_header t={t}/>
                    <tbody>
                        {this.renderOrders()}
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return{
        date: get(state, 'orders__main.filter.date', { start: moment().subtract(1, 'day'), get end(){return moment()} } ),
        order:get(state.orders__main, 'active', '')
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Table)

