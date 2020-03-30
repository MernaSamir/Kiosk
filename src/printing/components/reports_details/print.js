import React from 'react';
import { connect } from 'react-redux';
import PrinterComponent from 'helpers/components/printer';
import Report from './index'
import {get, toArray, pick, find} from 'lodash';
import mapDispatchToProps from 'helpers/actions/main'

const mapStateToProps = (state)=> ({
    pritnterGroup: find(state.settings__printer_group.data, { _type: 'receipt' }) || {},
    get printers() { return toArray(pick(state.settings__printer.data, this.pritnterGroup.printers)) },
    get printer() {
        return get(this.printers, '[0].name', 'POS')
    },
    receipts: get(state.Printing.print, "receipts"),
    printing: state.Printing.print,
    settings: get(state.Printing, 'print.settings')
})

export class PrintingZReport extends PrinterComponent {

    constructor(props) {
        super(props);
        setTimeout(()=>{
            this.print(this.finishPrinting)
        }, 100)
    }

    render() {
        return (
            <Report settings={this.props.settings} />
        );
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(PrintingZReport)
