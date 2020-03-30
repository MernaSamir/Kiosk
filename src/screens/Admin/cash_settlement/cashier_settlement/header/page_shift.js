import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './../style.less'

export default class PageShift extends Component {

    render() {
        return (
                <div className={classes.pag_div}>

                    <button type="button" className={classes.pag_btns}>
                        <FontAwesomeIcon icon="caret-left" className={classes.icon} />
                    </button>

                    <p>1 of 2</p>

                    <button type="button" className={classes.pag_btns}>
                        <FontAwesomeIcon icon="caret-right" className={classes.icon} />
                    </button>

                </div>
        )
    }
}
