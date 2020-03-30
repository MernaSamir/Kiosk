import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import classes from './style.less'
import { map } from 'lodash';
import {withTranslation} from 'react-i18next'

class AssignAllTables extends Component {

    renderWaiters = () => {
        const { waiters } = this.props
        return map(waiters, d => (
            <button type="button" onClick={this.assignAllTables.bind(this, d)}>
                {`${d.first_name} ${d.last_name}`}</button>
        ))
    }

    assignAllTables = (element) => {
        const { setAll, wOrders, setMain } = this.props
        setMain('auths__user', { active: element.id })
        const data = map(wOrders, d => {
            return { ...d, serve: element.id }
        })
        setAll([
            {type: 'set_main', app: 'auths__user', data: { active: element.id }},
            {
                type: 'set_main', app: 'orders__main', data: { 
                item: {
                    action: 'bulkEdit', data, onSuccess: this.afterAdd.bind(this, element)
                    } 
                }
            }
        ])
    }

    afterAdd = (data, element) => {
        return data.map(d => ({
            type: 'set_path_orders__main', 
            path: `data.${d.id}.serve`,
            data: element.id
        }))
    }

    closePopup = () => {
        const { setMain } = this.props
        setMain('popup', { popup: '' })
    }

    render() {
        const {t} = this.props
        return (
            <div className={classes.container}>
                <div className={classes.title}>
                    <p>{t("Assign Tables to")}</p>
                </div>
                <div className={classes.waiters_div}>{this.renderWaiters()}</div>
                <div className={classes.footer}>
                    <button type="button" onClick={this.closePopup.bind()}>{t("Cancel")}</button>
                    <button type="button" onClick={this.closePopup.bind()} id={classes.ok}>{t("Ok")}</button>
                </div>
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(withTranslation()(AssignAllTables))