import React, { Component } from 'react'
import classes from './style.less'
import { withRouter } from 'react-router'
import { withTranslation } from 'react-i18next';

 class CancelCustomer extends Component {
    ok = ()=>{
        const{onCancel , pressYes} = this.props
        pressYes()
        onCancel()
    }
    render() {
        const{onCancel , Title , first_msg, second_msg , t} = this.props
        return (
            <div className = {classes.all}>
                <p className={classes.title}>{t(Title)}</p>
                <div className={classes.msg}>
                    <p className={classes.first}>{t(first_msg)}</p>
                    <p className={classes.second}>{t(second_msg)}</p>
                </div>
                <div className={classes.last}>
                    <button type="button"  className={classes.submit} onClick={onCancel}>{t("No Keep")}</button>
                    <button type="submit" className={classes.cancel} onClick={this.ok}>{t("Yes Delete")}</button>
                </div>
            </div>
        )
    }
}
export default withTranslation()(withRouter(CancelCustomer))
