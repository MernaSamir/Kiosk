import React, { Component } from 'react'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Header extends Component {
  render() {
    const { page, pageMax, handelPageClick } = this.props
    return (
      <div className={classes.header}>
        <div className={classes.pagDiv}>
                <button type="button"  onClick={() => handelPageClick(-1)}>
                    <FontAwesomeIcon className = {classes.icon} icon="caret-left" />
                </button>
                <p> {page} of {pageMax?pageMax:1}</p>
                <button type="button"  onClick={() => handelPageClick(1)}>
                    <FontAwesomeIcon className = {classes.icon} icon="caret-right" />
                </button>
            </div>
      </div>
    )
  }
}
