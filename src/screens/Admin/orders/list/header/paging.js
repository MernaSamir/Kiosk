import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './style.less'
export default class Paging extends Component {
    render() {
        const { page, pageMax, handelPageClick } = this.props
        return (
            <div className={classes.pagDiv}>
                <button type="button"  onClick={() => handelPageClick(-1)} className={classes.button}>
                    <FontAwesomeIcon className = {classes.icon} icon="caret-left" />
                </button>
                <p> {page} of {pageMax}</p>
                <button type="button"  onClick={() => handelPageClick(1)} className={classes.button}>
                    <FontAwesomeIcon className = {classes.icon} icon="caret-right" />
                </button>
            </div>
        )
    }
}
