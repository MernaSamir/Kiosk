import React, { Component } from 'react'
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux'

class Buttons extends Component {
  activeAssign=()=>{
    const { setMain } = this.props
    setMain('dropdowns__delivery_group',{assign:true})
  }
  render() {
    const { assign } = this.props

    return (
      <button type='button' className={assign? (classes.btn && classes.active) : classes.btn} onClick={this.activeAssign}>Assign</button>
    )
  }
}
const mapStateToProps = (state) => ({
  assign: state.dropdowns__delivery_group.assign, 

})
export default connect(mapStateToProps, mapDispatchToProps)(Buttons)