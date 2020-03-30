import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { map, get, pickBy } from 'lodash'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Table extends Component {

    renderHead = () => {
        return <tr>
            <th>Station</th>
            <th>ORD</th>
        </tr>
    }

    renderBody = () => {
        const { orders } = this.props
        return map(orders, o => (
            <tr>
                <td>Station</td>
                <td>
                    <div onClick={this.removeAssign.bind(this, o)}>
                        {o.num} <FontAwesomeIcon icon="times" />
                    </div>
                </td>
            </tr>
        ))
    }

    removeAssign = (element) => {
        const { setMain } = this.props
        setMain('orders__main', {
            item: {
                action: 'update', id: element.id, delivery_person: null,
                onSuccess() {
                    return [
                        { type: 'set_path_orders__main', path: `data.${element.id}.delivery_person`, data: null }
                    ]
                }
            }
        })
    }

    renderTable = () => {
        return <table>
            <thead>{this.renderHead()}</thead>
            <tbody>{this.renderBody()}</tbody>
        </table>
    }

    render() {
        return (
            <div className={classes.table}>
                {this.renderTable()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: get(state.auths__user, `data.${get(state.auths__user, 'activeDel', '')}`, {}),
    get orders() { return pickBy(get(state.orders__main, 'data', {}), { delivery_person: this.user.id, end_time: null }) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Table)