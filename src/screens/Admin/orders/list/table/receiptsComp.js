import React, { Component } from 'react'
import { connect } from 'react-redux'
import { map, filter, get, isEqual,pick } from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import Collapse from './collapse'
import TableCollapse from './collapse_table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class receiptsComp extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['order',"receipts"]
        return !isEqual(pick(this.props, compare), pick(nextProps, compare))
    }
    renderClick = (r) => {
        const { setMain } = this.props
        setMain("orders__main", { active: r.order })
        setMain("orders__receipt", { active: r.id })
        // setMain('receiptsItems', { item: {} })
    }
    renderReceipts = () => {
        const { receipts, order, table } = this.props

        if (receipts.length == 1) {

            return (map(receipts, (r, idx) => {
                return <td  key={idx} onClick={() => this.renderClick(r)}>
            <FontAwesomeIcon icon='hashtag'/>{r.number} {table&&`T:${table.name}`}</td>
            }))
        }
        else if (receipts.length > 1) {
            return <td > ( {receipts.length} )
                <Collapse order={order} >
                    <TableCollapse order={order} />
                </Collapse>
            </td>
        }
        else return <td >{order.canceled_time&&'Cancelled' || order.combined&&'Combined'}</td>
    }


    render() {
        return (

            this.renderReceipts()
        )

    }
}

const mapStateToProps = (state, props) => ({
    get receipts() { return filter(state.orders__receipt.data, { order: props.order.id }) },
    get orders() { return filter(get(state, 'orders__main.data'), { id: props.order }) },
    table: get(state.dinin__tables.data, props.order.table, false) 
})

export default connect(mapStateToProps, mapDispatchToProps)(receiptsComp)
