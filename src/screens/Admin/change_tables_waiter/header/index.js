import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Back_Button from 'components/Back_Button'
import classes from './../style.less'
import Buttons from './buttons';
import Pagination from './pagination';

class Header extends Component {

    
    render() {
        const { page, click, maxPage, enableClick, enableclick, t } = this.props
        return (
            <div className={classes.header}>
                <Back_Button />
                <p>{t('Change Tables Waiter')}</p>
                <div className={classes.btn_pag_container}>
                    <Buttons enableClick={enableClick} enableclick={enableclick} t={t}/>
                    <Pagination page={page} maxPage={maxPage} click={click}/>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)