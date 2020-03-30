import React, { Component } from 'react'
import classes from './styles.less';
import { withRouter } from 'react-router-dom'
import ViewAction from './Components/view_actions'
import DatePicker from 'components/date_selector'
import ReservationAction from  './Components/reservation_action'
import Header from 'components/header_back'
 class ReservationHeader extends Component {
   actions = ()=>(
     <>
    <div className={classes.second}>
    <div className={classes.left}> <ViewAction /></div>
    <div className={classes.between}><DatePicker reduxName='parties__reservation'/> </div>
     <div className={classes.right}><ReservationAction/></div>
     </div>
     </>

   )
  render() {
      
    return (<>
        <Header name="Reservations"/>
    {this.actions()}
    </>
    )
  }
}
export default withRouter(ReservationHeader)
