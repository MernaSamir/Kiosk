import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Route } from 'react-router-dom'
import DeliveryPersons from './delivery_persons';
import Info from './deliver_person_info';
import classes from './style.less'

class LeftPart extends Component {

  rendering = () => {
    const { history } = this.props
    if (history.location.pathname.includes('info')) {
      return this.gotoInfo()
    }
    return this.gotoDefault()
  }

  gotoInfo = () => {
    const { match } = this.props
    return <div className={classes.left_part}>
      <Route path={`${match.url}/info`} component={Info} />
    </div>
  }

  gotoDefault = () => {
    const { match } = this.props
    return <div className={classes.left_part}>
      <Route path={`${match.url}/`} component={DeliveryPersons} />
    </div >
  }

  render() {
    return (
      this.rendering()
    )
  }
}

export default withRouter(LeftPart)