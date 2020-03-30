import React, { Component } from 'react'
import { connect } from 'react-redux'
import { map, pick, flatten ,filter , get } from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'

export class salesComp extends Component {


    renderReceipts = () => {
        const { receiptsItems } = this.props
        return map(receiptsItems, r => r.payment)
    }

    render() {
        return (
            <td className='th-name td-text center'>
                {this.renderReceipts()}
            </td>
        )
    }
}

const mapStateToProps = (state, props) => ({
    get receipts() { return filter(get(state, 'receipts.data'), { order: props.order }) },

    get receiptsItems(){return pick(state.orders__receipt_items.data, flatten(map(this.receipts, d=>(d.receiptitems_set))))},

})



export default connect(mapStateToProps, mapDispatchToProps)(salesComp)
