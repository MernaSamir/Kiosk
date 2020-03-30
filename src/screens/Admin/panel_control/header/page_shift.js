import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './../style.less'

export default class PageShift extends Component {

    click = (value) => {
        const { handelPageClick } = this.props
        handelPageClick(value)
    }

    render() {
        const { page, maxPage } = this.props
        return (
            <div className={classes.pag_div}>

                <button type="button" className={classes.pag_btns} onClick={this.click.bind(this, -1)}>
                    <FontAwesomeIcon icon="caret-left" className={classes.icon} />
                </button>

                <p>{`${page} of ${maxPage}`} </p>

                <button type="button" className={classes.pag_btns} onClick={this.click.bind(this, 1)}>
                    <FontAwesomeIcon icon="caret-right" className={classes.icon} />
                </button>
            </div>
        )
    }
}