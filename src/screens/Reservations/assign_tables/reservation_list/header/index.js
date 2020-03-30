import React, { Component } from 'react'
import DatePicker from 'components/date_selector';
import classes from '../styles.less'
import { withRouter } from 'react-router-dom'
import TimePicker from 'components/time_selector'
class DataPicker extends Component {
  render() {
    return (
      <>
        <div className={classes.datepic}>
          <DatePicker className={classes.picker} reduxName='parties__reservation' Icon="chevron" />
        </div>
        <TimePicker/>

     </>


    )
  }
}
export default withRouter(DataPicker)
