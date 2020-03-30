import React, { Component } from 'react'
import { map, get } from 'lodash'
import classes from './../../styles.less';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { withTranslation } from 'react-i18next';



class CTable extends Component {

    renderHeaders = () => {
        const { Table ,t} = this.props
        return map(Table(), (d, index) => {
            return <th key={index} className={d.class}>{t(d.head)}</th>
        })
    }
    renderRowData = (row) => {
        const { Table } = this.props

        const { setMain } = this.props
        return map(Table(row, setMain), (d, index) => {
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
                        )).slice(10 * (page - 1), 10 * page)}
                    </tbody>
                </table>
            </>
        )
    }
}

export default connect(null, mapDispatchToProps)(withTranslation()(CTable))
