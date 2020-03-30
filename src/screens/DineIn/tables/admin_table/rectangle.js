import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {connect} from 'react-redux'
import { get } from 'lodash';
import {getSize} from 'helpers'
import classes from './style.less';


class Rectangle extends Component {
  

  
  render() {
    const { table, unit, displayPopup, active} = this.props
    const size = getSize(table.shape, table.size, unit)
    
    

    return (

      <div
        id={'popup'+ table.id}
        className={ table.id==active? `${classes.tableRec} ${classes.active}` : classes.tableRec}
        onClick={displayPopup.bind(this)}
        style={{ width:`${size.width}vw`,height:`${size.height}vw` }}
      >
        <div className={classes.start}>
          <div className={classes.tableTitle}>{table.name} </div>
        </div>

        <div className={classes.tableFlex} >
        
          <div className={classes.end}><FontAwesomeIcon style={{ display: table.closed ? "block" : "none" }}
           className={classes.icon} icon="lock" /></div>
        </div>

        

        


      </div>

    )
  }
}


export default Rectangle

