import React, { Component } from 'react'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Tab extends Component {
  renderTab=()=>{
    const {guest={}, type , index} = this.props
    if(type=='add')
        return<> < FontAwesomeIcon className={classes.icon} icon='plus'/>
        <p className={classes.new}>Open New Tab</p>
        </>
    else
        return <p>{guest.name|| `Guest # ${index}` }</p>

}


  render() {
    const {onClick} = this.props

    return (
      <div className={classes.tab}onClick={onClick}>
        {this.renderTab()}
      </div>
    )
  }
}
