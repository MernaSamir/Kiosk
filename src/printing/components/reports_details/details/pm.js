import React, { Component } from 'react'
import classes from '../style.less'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { map, get } from 'lodash'
import applyFilters from 'helpers/functions/filters'
import {round} from 'lodash'

const fileds= {
    NetSales: {
        key: "Qty",
        value: 'totals.items.items_sales.qty'
    },
    Receipts: {
        key: "Item Sales",
        value: 'totals.items.items_sales.val'
    }
}

export class OtherMode extends Component {
    renderHeaders = () => {
        return map(fileds, (d, index) => {
            return <th key={index} className={classes.key}>{d.key}</th>
        })
    }
    renderRow = (list, idx) => {
        const { settings } = this.props
        return map(list, (d, index) => {
            const name = applyFilters({ path: `${settings.reduxNameList[idx]}.data.${index}` })
            const padding = 10 * idx
            return <><tr key={index} className={classes.modesBody}>
                <td style={{ paddingLeft: padding }}>{get(name, 'name', '')}</td>
                {this.renderCells(d, index)}
            </tr>
                {
                    d.childs ? this.renderRow(d.childs, idx + 1) : undefined
                }
            </>
        })
    }

    renderCells = (row, rowIndex) => {
        return map(fileds, (d, index) => {
            return <th key={index} className={classes.key}>
                {round(get(row, d.value, row), 2)}
            </th>
        })
    }

    render() {
        const { settings, data } = this.props
        return (
            <div className={classes.details}>
                <p className={classes.title}>{settings.title}</p>
                <table>
                    <thead >
                        <tr className={classes.modesHead}>
                            <th></th>
                            {this.renderHeaders()}
                        </tr>
                    </thead>
                    <tbody >
                        {this.renderRow(data, 0)}
                    </tbody>
                </table>
            </div>

        )
    }
}

const mapStateToProps = (state, props) => ({
    data: get(state.report, 'data.childs', {}),
})

export default connect(mapStateToProps, mapDispatchToProps)(OtherMode)