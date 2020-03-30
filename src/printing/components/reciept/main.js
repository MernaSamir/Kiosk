import React from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import applyFilters from 'helpers/functions/filters'
import PrinterComponent from 'helpers/components/printer';
import Header from './components/header'
import Bill from './components/bill'
import Footer from './components/footer'
import { get, defaults } from 'lodash';
import classes from './style.less'
import {Translate} from 'helpers/functions/main'


class Receipt extends PrinterComponent {

    constructor(props) {
        super(props);
        this.printedReceipts = props.receipts
        this.printingReceipts(0)
    }

    printingReceipts = (active, data) => {
        const { receipts, setPath, gun, location, bd } = this.props;
        if (active == get(receipts, 'length', 0)) {
            if(gun && get(receipts, 'length', 0)){
                this.printedReceipts = receipts.reduce((o, d) => ({ ...o, [d]: true }), {})
                gun.get('loc').get(location).get(bd).get('receipts').put(this.printedReceipts)
            }
            this.finishPrinting()
        }
        else {
            setPath('Printing', 'print.print', active)
            setTimeout(() => {
                this.print(this.printingReceipts.bind(this, active + 1))
            }, 200)
        }
    }
    translate = (text) => {
        const {printerGroup={}} = this.props
        return Translate(text, printerGroup.lang)
    }
    render() {
        const { receipt, currentReceipt = receipt, active_location, printerGroup } = this.props;
        const chain_receipt = applyFilters({
            key: 'Find',
            path: 'settings__chain_customer_receipt',
            params: {
                chain: active_location.chain
            }
        })
        const location_receipt = applyFilters({
            key: 'Find',
            path: 'settings__customer_receipt',
            params: {
                chain: active_location.chain
            }
        })
        const receipt_settings =
            defaults({ ...chain_receipt, ...location_receipt },
                { logo: './logo.png' , modifiers_details: true})
        if (currentReceipt) {
            const show = printerGroup.show == 'a' ? 'alter_name':'name'
            return (
                <div className={classes.receipt_container}>
                    <Header show={show} translate={this.translate} receipt={currentReceipt} receipt_settings={receipt_settings} />
                    <Bill show={show} translate={this.translate} details={this.props.details} currentReceipt={currentReceipt} receipt_settings={receipt_settings} />
                    <Footer show={show} translate={this.translate} receipt_settings={receipt_settings} />
                </div>
            )
        }
        return <div></div>
    }
}

const mapStateToProps = (state, props) => ({
    receipts: get(state.Printing.print, "receipts"),
    printing: state.Printing.print,
    active_location: get(state.licensing__location.data, state.licensing__location.active, {}),
    printer: get(props.printers, '[0].name', 'POS'),
    location: get(state.licensing__location, 'active', ''),
    gun: get(state.guns, 'loc', ''),
    bd: state.orders__business_days.active
})

export default connect(mapStateToProps, mapDispatchToProps)(Receipt);