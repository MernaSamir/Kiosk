import React, { Component } from 'react'
import { map, get } from 'lodash'
import classes from './../../styles.less';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { withTranslation } from 'react-i18next';

class CTable extends Component {

    tabs = {
        "ns": 'Not Sended',
        "nc": 'Confirm',
        "stl": 'Send',
        'failed': 'Failed',
    }

    constructor(props) {
        super(props);
        this.fun = { key: 'diff', compare: 'select.created_at', label: true }
    }

    renderHeaders = () => {
        const { Table, t } = this.props
        return map(Table(), (d, index) => {
            return <th key={index} className={d.class}>{t(d.head)}</th>
        })
    }

    renderRowData = (row) => {
        const status = get(this.tabs, row.status || 'ns')
        const { Table } = this.props
        return map(Table(row, status, this.fun), (d, index) => {
            return <td key={index} className={d.class}>{get(row, d.view, d.Component)}</td>
        })
    }


    render() {
        const { page, list } = this.props
        return (
            <>
                <table className={classes.reserv_list}>
                    <thead>
                        <tr  >{this.renderHeaders()}</tr>
                    </thead>
                    <tbody>
                        {map(list, (d, key) => (
                            <tr className={classes.trs} key={key}>{this.renderRowData(d)}</tr>
                        )).slice(8 * (page - 1), 8 * page)}
                    </tbody>
                </table>
            </>
        )
    }
}

export default connect(null, mapDispatchToProps)(withTranslation()(CTable))
