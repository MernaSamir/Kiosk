import React, { Component } from 'react'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Paging extends Component {
  render() {
    const { page, pageMax, handelPageClick , style} = this.props
    return (
        <div className={style?style:classes.pagDiv}>
        <button type="button"  onClick={() => handelPageClick(-1)}>
            <FontAwesomeIcon className = {classes.icon} icon="caret-left" />
        </button>
        <p> {page} of {pageMax?pageMax:1}</p>
        <button type="button"  onClick={() => handelPageClick(1)}>
            <FontAwesomeIcon className = {classes.icon} icon="caret-right" />
        </button>
    </div>
    )
  }
}
