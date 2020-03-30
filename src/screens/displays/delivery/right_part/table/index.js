import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get, map, pickBy, find } from 'lodash'
import classes from './style.less'
import Row from './row';
import applyFilters from 'helpers/functions/filters';
import app from '../../../../../helpers/app';
class Table extends Component {

    renderHead = () => {
        const headers = ["", "Address", "Area", "Time", "ORD", "Notes", "Print"]
        return <tr>{headers.map((d, i) => <th key={i} >{d}</th>)} </tr>
    }

    renderOrder = () => {
        const { modes, sub_modes, current_location } = this.props
        const delivery = find(modes, { key: 'DL' })
        const callcenter = find(modes, { key: 'CC' })
        const sub_mode = find(sub_modes, { mode: get(callcenter, 'id', {}), key: 'delivery' })
        const mode = get(callcenter, 'id', {}) || get(delivery, 'id', {})
        let list = applyFilters({
            key: "Filter",
            path: 'orders__main',
            params: {
                mode: mode,
                end_time: null,
                sub_mode: sub_mode.id,
                served_location: current_location,
                status: 'failed'
            }
        })
        list = [...list, ...applyFilters({
            key: "Filter",
            path: 'orders__main',
            params: {
                mode: mode,
                end_time: null,
                sub_mode: sub_mode.id,
                served_location: current_location,
                status: 'stl'
            }
        })]
        return map(list, o => (
            <Row element={o} />
        ))
    }

    render() {
        return (
            <table className={classes.table}>
                <thead>
                    {this.renderHead()}
                </thead>
                <tbody>
                    {this.renderOrder()}
                </tbody>
            </table>
        )
    }
}

const mapStateToProps = (state) => ({

    modes: get(state.settings__mode, 'data', {}),
    sub_modes: get(state.settings__sub_mode, 'data', {}),
    current_location: state.licensing__location.active
})

export default connect(mapStateToProps)(Table)