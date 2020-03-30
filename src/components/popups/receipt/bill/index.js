import React, { Component } from 'react';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main';
import Receipt from 'printing/components/reciept'
import { get, pick, map } from 'lodash';
// import ReceiptHeader from 'printing/components/reciept/components/header';
// import ReceiptBill from 'printing/components/reciept/components/bill';
// import applyFilters from 'helpers/functions/filters'

class Bill extends Component {

    constructor(props) {
        super(props);
    }
    renderReceipt = () => {
        const { receipt } = this.props
        return <Receipt receipt={receipt} details={receipt.items} currentReceipt={receipt} />
        // <>
        //     <ReceiptHeader receipt={receipt} />
        //     <ReceiptBill details={receipt.items} currentReceipt={receipt} />
        // </>
    }

    render() {
        return (
            <section>

                {this.renderReceipt()}
            </section>
        );
    }
}

const mapStateToProps = (state, props) => ({
    receipts: get(state.popup, 'popup.receipts', {}),
    get receipt() { return get(this.receipts, `[${props.active}]`, {}) },
    get details() { return pick(state.orders__details.data, map(get(this.receipt, `items`, []), (d) => (d.details))) },
    seat_num: get(state.orders__receipt, 'seat_num', '')
})

export default connect(mapStateToProps, mapDispatchToProps)(Bill);