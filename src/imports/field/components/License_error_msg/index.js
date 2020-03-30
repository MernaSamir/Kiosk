import React, { Component } from 'react'
import classes from './style.less';
import Sync from 'components/Sync';
class LicenceError extends Component {
  render() {
      return (
          <div className={classes.error}>
            <p>
                Sync Licensing Needed.....
                <br/>
                Please Contact Us or Sync Your License {localStorage.getItem('deviceId')}
            </p>
            {<Sync />}
          </div>
    )
  }
}
export default  LicenceError
