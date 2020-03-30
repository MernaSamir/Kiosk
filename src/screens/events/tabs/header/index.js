import React, { Component } from 'react'
import classes from './styles.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {withRouter} from 'react-router-dom'
import Page from './page'
import applyFilters from 'helpers/functions/filters';
import {get} from 'lodash'

 class Header extends Component {

  getReservation=()=>{
    const {reservation} = this.props
    return get(applyFilters({
      path:`parties__reservation.data.${reservation}`
    }),'event_name', '')
  }
  render() {
    const { page, pageMax, handelPageClick, history } = this.props
    return (
      <div className={classes.header}>
          <div className={classes.title}>
              <button onClick={history.goBack.bind(this)}>
                  <FontAwesomeIcon  className={classes.icon} icon ='arrow-left'/>
              Back
              </button>
            <p>{this.getReservation()}</p>
          </div>
        <div className={classes.actions}>
        <Page {...{page, pageMax, handelPageClick}}/>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)