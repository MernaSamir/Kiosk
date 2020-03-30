import React, { Component } from 'react'
import classes from './style.less'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { map, find } from 'lodash'
import applyFilters from 'helpers/functions/filters';
import { withTranslation } from 'react-i18next';


class Actions extends Component {

    SaveCheck = () => {
        const { onCancel, activeReservation, setMain } = this.props
        onCancel()
        const GuestsToTabs = applyFilters({
            key: 'Filter',
            path: "parties__event_checkin",
            params: {
                reservation: activeReservation,
            }
        })
        const ExistTabs = applyFilters({
            key: 'Filter',
            path: "parties__event_tab",
            params: {
                reservation: activeReservation,
            }
        })
        const data = map(GuestsToTabs, (d, index) => {
            const Tab = find(ExistTabs, (v) => v.checkin == d.id, {})
            return { ...Tab, reservation: d.reservation, checkin: d.id, name: d.name }

        })
        setMain('parties__event_tab', { item: { data, action: 'bulkEdit', onSuccess: this.openTabs } })
    }

    openTabs = () => {
        const { history } = this.props
        history.push('./event_tabs')
        return []
    }

    render() {
        const { t } = this.props

        return (
            <div className={classes.button}>
                <button type="button" onClick={this.SaveCheck}>{t("Done")}</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withRouter(Actions)))
