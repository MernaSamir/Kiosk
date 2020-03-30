import React, { Component } from 'react'
import classes from '../style.less'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { map, get, round } from 'lodash'
import applyFilters from 'helpers/functions/filters'

export class OtherMode extends Component {
    renderHeaders = () => {
        const { settings } = this.props
        return map(settings.fileds, (d, index) => {
            return <th key={index} className={classes.key}>{d.key}</th>
        })
    }
    renderRow = () => {
        const { data, settings } = this.props
        const { show = 'default' } = settings
        return map(data, (d, index) => {
            const showTypes = {
                'default': get(applyFilters({ path: `${settings.reduxName}.data.${index}` }), 'name', ""),
                'md': `${get(d, 'key[1]', '')} / ${get(d, 'key[0]', '')}`,
                'h': get(d, 'key', '')
            }
            return <tr key={index} className={classes.modesBody}>
                <td>{get(showTypes, show, '')}</td>
                {this.renderCells(d, index)}
            </tr>
        })
    }

    renderCells = (row, rowIndex) => {
        const { settings } = this.props
        return map(settings.fileds, (d, index) => {
            return <th key={index} className={classes.key}>
                {round(get(row, d.value, row), 2)}
            </th>
        })
    }

    render() {
        const { settings } = this.props
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
                        {this.renderRow()}
                    </tbody>
                </table>
            </div>

        )
    }
}

const mapStateToProps = (state, props) => ({
    data: get(state.report, props.settings.data_path, {}),
})

export default connect(mapStateToProps, mapDispatchToProps)(OtherMode)