import React, { Component } from 'react'
import classes from '../styles.less'
import {isEqual} from 'lodash';
import { withRouter } from 'react-router-dom'
import { withTranslation } from 'react-i18next';

class Reservation extends Component {
  onClick = () => {
    const{history}=this.props
    history.push('/new_reservation')
  }
  assignTables = () =>{
    const{history}=this.props
    history.push('/assign_tables')
  }

  render() {
    const {location, t} = this.props;
    return (
      <>
        <button className={classes.reserBtns}  onClick={this.assignTables}>{t("Assign Tables")}</button>
        <button className={`${classes.reserBtns} ${isEqual(location.pathname, '/new_reservation') && classes.active}`} onClick={this.onClick}
        >{t("New Reservation")}</button>
      </>
    )
  }
}
export default withRouter(withTranslation()(Reservation));