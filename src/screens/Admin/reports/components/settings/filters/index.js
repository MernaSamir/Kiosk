import React, { Component } from 'react'
import Dropdown from '../dropdown'
import { map, get } from 'lodash'
import classes from "./style.less"
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters'

const filters = [
    { label: "Station", reduxName: 'licensing__station', show: 'name', name: 'station' },
    { label: "Cashier", reduxName: 'auths__user', show: 'name', params: { 'is_cashier': true }, name: 'cashier' },
    { label: "Waiter", reduxName: 'auths__user', show: 'name', params: { 'is_waiter': true }, name: 'waiter' },
]
class Filters extends Component {

    renderFilters() {
        const {  values ,t} = this.props
        return (map(filters, (d) => {
            return (<div>
                <p>{t(d.label)}</p>
                <Dropdown data={applyFilters({
                    key: 'Filter',
                    path: d.reduxName,
                    params: d.params
                })}
                    show={d.show}
                    value={get(values, d.name, '')}
                    name={d.name} />
            </div>)
        }))
    }
    render() {
        const {t}= this.props
        return (
            <div className={classes.container}>
                <p className={classes.title}>{t("Filters")}</p>
                {this.renderFilters()}
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    waiters: state.auths__user.data,
})
export default connect(mapStateToProps, mapDispatchToProps)(Filters)
