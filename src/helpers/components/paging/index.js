import React, { Component } from 'react'
import classes from './style.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Paging extends Component {


    click = (value, maxLength, page) => {
        const { handelClick } = this.props
        if (!(page <= 1 && value == -1) && !(page >= maxLength && value == 1)) {
            handelClick(value)
        }
    }
    render() {
        const { maxLength, page } = this.props
        return (
            < div className={classes.paging} >
                <button type='button' onClick={this.click.bind(this, -1, maxLength, page)}>
                    <FontAwesomeIcon icon="caret-left" size="lg" />
                </button>
                <p >{`${page} of ${maxLength || 1}`}</p>
                <button  type='button' onClick={this.click.bind(this, 1, maxLength, page)}>
                    <FontAwesomeIcon icon="caret-right" size="lg" />
                </button>
            </div >
        )
    }
}
