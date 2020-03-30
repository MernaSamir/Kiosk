import React, { Component } from 'react'
import Header from './header';
import Checks from './checks';
import classes from './style.less'
import {connect} from 'react-redux'
import{get, keys, range} from 'lodash'

class SplitCheck extends Component {
    state={
        page: 1
      }
      constructor(props){
        super(props);
        this.seats = range(0,props.order.guests_num+1).map(i=>i)
        
      }
      handelPageClick = (op) => {
        const { page } = this.state
        let pageMax = Math.ceil((keys(this.seats) || []).length / 3)
        if (!(page <= 1 && op == -1) && !(page >= pageMax && op == 1)) {
            this.setState({ page: page + op })
        }
      }
    render () {
        const {page}=  this.state
        let pageMax = Math.ceil((keys(this.seats) || []).length / 3)
        return (
            <div className={classes.container}>
                <Header {...{page, pageMax}} handelPageClick={this.handelPageClick}/>
                <Checks {...{page}}/>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => ({
    order: get(state, `orders__main.data.${state.orders__main.active}`, {}),
    
})
export default connect(mapStateToProps)(SplitCheck)
