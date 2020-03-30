import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import classes from './style.less'

class Buttons extends Component {
  gotoGroup_Dif = () => {
    const { history } = this.props
    history.push('/group_Dif')
  }

  render() {
    return (
      <div className={classes.btns}>
        <button type="button" onClick={this.gotoGroup_Dif.bind()} >Group Def.</button>
        <button type="button">Reports</button>
      </div>
    )
  }
}

export default withRouter(Buttons)