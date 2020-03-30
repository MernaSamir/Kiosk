import React, { Component } from 'react'
import classes from './../../style.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Pagination extends Component {

  render() {
    return (
        <div className={classes.pag_div}>
            <button type="button" className={classes.pag_btn}>
                <FontAwesomeIcon icon="caret-left" className={classes.icon} />
            </button>
            <p>1 of 2</p>
            <button type="button" className={classes.pag_btn}>
                <FontAwesomeIcon icon="caret-right" className={classes.icon} />
            </button>
        </div>
    )
  }
}
