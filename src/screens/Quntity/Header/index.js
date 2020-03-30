import React, { Component } from 'react'
// import '../style.css';
import Back_Button from 'components/Back_Button'
import { withRouter } from 'react-router-dom'
import classes from './style.less'
import { withTranslation } from 'react-i18next';

class Header extends Component {

    backBtn = () => {
        const { history, setMain } = this.props
        setMain('orders__details', { active: '' })
        history.push('/home')
    }

    render() {
        const { name , t } = this.props

        return (
            <div className ={classes.flexCol}>
                <div className={classes.header}>
                    <Back_Button onClick={this.backBtn} />
                    <p >{t("Quantity")}</p>
                </div>
                <span >{t("Items selected")}: {name} </span>
            </div>
        )
    }
}

export default withRouter( withTranslation()(Header))