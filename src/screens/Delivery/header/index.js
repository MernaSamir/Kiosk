import React, { Component } from 'react'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Header extends Component {
    renderTitlt = () => {
        return <div className={classes.title}>
            <p>{`Delivery - New Order`}</p>
        </div>
    }

    renderSearch = () => {
        return <div className={classes.search_div}>
            <input className={classes.search_input} placeholder="Search Customer" />
            <FontAwesomeIcon icon="search" className={classes.icon} />
        </div>
    }

    renderNewCusBtn = () => {
        return <button type="button" className={classes.btn}>New Customer</button>
    }

    renderPagination = () => {
        return < div className={classes.search_btn_pag_row} >
            {this.renderSearch()}
            <div className={classes.btn_pag_div}>
                {this.renderNewCusBtn()}
                <div className={classes.pag_div}>
                    {this.renderPagBtns("left", -1)}
                    {this.renderPageNum()}
                    {this.renderPagBtns("right", 1)}
                </div>
            </div>
        </div >
    }

    renderPagBtns = (type, value) => {
        return <button type="button" className={classes.pag_btn} onClick={this.onClick.bind(this, value)}>
            <FontAwesomeIcon icon={`caret-${type}`} className={classes.icon} />
        </button>
    }

    onClick = (value) => {
        const { handleClick } = this.props
        handleClick(value)
    }

    renderPageNum = () => {
        const { maxPage, page } = this.props
        return <p>{page} of {maxPage}</p>
    }

    render() {
        return (
            <>
                {this.renderTitlt()}
                {this.renderPagination()}
            </>
        )
    }
}
