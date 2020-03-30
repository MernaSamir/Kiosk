import React, { Component } from 'react'
import { connect } from 'react-redux'
import { map, filter, get } from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'

class TableCollapse extends Component {

    renderBody = () => {
        const { receipts, table } = this.props
        return (map(receipts, (r, idx) => {
            return <><tr key={idx} onClick={() => this.renderClick(r)} >
                <td >
                {table&&`T:${table.name}`}{r.number}
                </td>
            </tr>

            </>
        }))
    }

    renderClick = (r) => {
        const { setMain } = this.props
        setMain('orders__main',{active:r.order})
        setMain("orders__receipt",{active: r.id})
        

    }
    render() {
        return (
            <div className='customer-list '>
                <table className="admin-order-table">
                    <tbody>
                        {this.renderBody()}
                    </tbody>
                </table>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    get receipts() { return filter(get(state, 'orders__receipt.data'), { order: props.order.id }) },
    table: get(state.dinin__tables.data, props.order.table, false) 
})



export default connect(mapStateToProps, mapDispatchToProps)(TableCollapse)
