import React, { Component } from 'react'
import style from './style.less'
import Dates_title from './dates_title'
import Search from './search'
import Dropdown from './dropdown'
import Paging from './paging'
import refund from 'assets/images/refund.svg'
import Back from 'components/Back_Button'

class Header extends Component {
    render() {
        const { page, pageMax, handelPageClick, t } = this.props
        return (
            <div className={style.main_container}>
            
                <div className={style.date}>
                <Back/>
                    <Dates_title t={t}/>
                    
                </div>

                <div className={style.container}>
                    <div className={style.refund}>
                        <img src={refund}/>
                        <span>{t('Refunded Orders')} / {t('Items')}</span>
                    </div>
                    <div className={style.actions}>
                        <Dropdown />
                        <Search />
                        <Paging page={page} pageMax={pageMax} handelPageClick={handelPageClick} /> 
                    </div>
                </div> 
            </div>
        )
    }
}
export default Header
