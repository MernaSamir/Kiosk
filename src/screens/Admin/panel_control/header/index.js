import React, { Component } from 'react'
import classes from './../style.less'
import HeaderSearch from './header_search'
import PageShift from './page_shift'
import Search from 'components/search'

export default class Header extends Component {
    render() {
        const { page, maxPage, handelPageClick , t} = this.props

        return (
            <div className={classes.title_div}>
                <p style={{ marginLeft: '40%' }} className={classes.title}>{t('Manager Dashboard')}</p>
                {/* <div className={classes.pag_search_div}>
                    <Search/>
                    <PageShift page={page} maxPage={maxPage} handelPageClick={handelPageClick} />
                </div> */}
            </div>
        )
    }
}