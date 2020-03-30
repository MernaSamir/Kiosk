import React, { Component } from 'react'
import classes from './../style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Pagination extends Component {

    handelClick = (op) => {
        const { page, maxPage, click } = this.props
        if (!(op == -1 && page <= 1) && !(op == 1 && page >= maxPage)) {
            click(op)
        }

    }
    render() {
        const { page, maxPage } = this.props
        return (
            <div className={classes.pag_container}>
                <button type="button" onClick={this.handelClick.bind(this, -1)}>
                    <FontAwesomeIcon icon="caret-left" className={classes.icon} />
                </button>
                <p>{`${page} of ${maxPage}`}</p>
                <button type="button" onClick={this.handelClick.bind(this, 1)}>
                    <FontAwesomeIcon icon="caret-right" className={classes.icon} />
                </button>
            </div>
        )
    }
}
