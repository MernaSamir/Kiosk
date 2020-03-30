import React, { Component } from 'react'
import SetMenu from './tabs/set_menu/index';
import classes from './styles.less'
import { withTranslation } from 'react-i18next';

 class Menu extends Component {
    render() {
        const {t , values} = this.props
        return (
            <div className={classes.contaier}>
                <div className={classes.header}>
                <p>{t("Prouduct Details")}</p>
                    {/* <p>{t("Total")}: 00.00</p> */}
                </div>
                       <SetMenu values={values}/>
            </div>
        )
    }
}
export default withTranslation()(Menu)
