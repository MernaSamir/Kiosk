import React from 'react';
import { connect } from 'react-redux';
import PrinterComponent from 'helpers/components/printer';
import Report from './components'
import {get} from 'lodash';
import mapDispatchToProps from 'helpers/actions/main'
const mapStateToProps = (state)=> ({
    printer: get(state.settings, 'receipt_printer', 'POS'),
    data: get(state.Printing.print, "data")
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
            <Report data={this.props.data} />
        );
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(PrintingZReport)
