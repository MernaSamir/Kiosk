import React, { Component } from 'react'
import classes from './../style.less'
import { withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {withTranslation} from 'react-i18next'
class Header extends Component {
    render() {
        const { history, orders, t } = this.props
        return (
            <div className={classes.title}>
                <button type="button" className={classes.back_btn} onClick={() => history.goBack()}>
                    <FontAwesomeIcon icon="arrow-left" className={classes.icon} />
                    <p>{t('Back')}</p>
                </button>
                <section>
                    <p> {t('Day')} / {t('Shift')}</p>
                    <p>
                        {orders.length ? `${orders.length} ${t('active order')}`:''}
                    </p>
                </section>
            </div>
        )
    }
}

export default withRouter(withTranslation()(Header))