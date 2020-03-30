import React, { Component } from 'react'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default class Tab extends Component {
    renderTab=()=>{
        const {order, type} = this.props
        if(type=='add')
            return<> < FontAwesomeIcon className={classes.icon} icon='plus'/>
            <p className={classes.new}>Open New Tab</p>
            </>
        else
            return<p>T {order.num}</p>
    }
  render() {
      const {onClick, order} = this.props
    return (
      <div className={classes.tab} onClick={onClick.bind(this, order)}>
        {this.renderTab()}
      </div>
    )
  }
}
