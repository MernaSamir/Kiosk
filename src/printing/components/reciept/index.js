import React, {Component} from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import applyFilters from 'helpers/functions/filters'
import { get, pick, toArray } from 'lodash';
import Print from './main'


class Receipt extends Component {

    getPrinterGroup(){
        const {receipt, currentReceipt=receipt} = this.props;
        this.mainPrinters = applyFilters({
            path: 'settings__printer.data'
        })
        const data = applyFilters({
            key: 'multiApply',
            apps: {
                ord: {
                    key: 'chain',
                    selectors: {
                        "orders__main": "order"
                    },
                },
                table: {
                    key: 'chain',
                    selectors: {
                        "orders__main": "order",
                        "dinin__tables": "table"
                    },
                },
            }
        }, currentReceipt)
        let params = {mode: get(data, 'ord.mode')}
        const table = get(data, 'table', {})
        if(table.zone){
            params.zones = table.zone
        }
        const printersGroups = applyFilters({
            key: 'Filter',
            path: 'settings__printer_group',
            params: {
                '_type': 'receipt'
            },
            then: {
                key: 'oring',
                funs: {
                    params: {
                        key: 'IncludesOne',
                        params: {mode: get(data, 'ord.mode')},
                    },
                    no_mode: {
                        key: "compare",
                        compare: 'eq',
                        val: 0,
                        to: 'mode.length'
                    }
                },
                then: {
                    key: 'oring',
                    funs: {
                        params: {
                            key: 'IncludesOne',
                            params: {zone: get(data, 'table.zone')},
                        },
                        no_mode: {
                            key: "compare",
                            compare: 'eq',
                            val: 0,
                            to: 'zones.length'
                        }
                    }
                }
            }
        })
        this.printerGroup = get(printersGroups, '[0]', {}) || {}
        this.printers = toArray(pick(this.mainPrinters, get(this.printerGroup, "printers", [])))
    }
    
    render() {
        this.getPrinterGroup()
        const c_props = ["receipt", "currentReceipt"]
        return <Print {...pick(this.props, c_props)} printerGroup={this.printerGroup} printers={this.printers}></Print>
    }
}

const mapStateToProps = (state) => ({
    receipts: get(state.Printing.print, "receipts", []),
    receipt_num: get(state.Printing.print, 'print'),
    get receipt_id() { return get(state.Printing.print, `receipts.[${this.receipt_num}]`) },
    get receipt() { return get(state.orders__receipt, `data.${this.receipt_id}`) },
})

export default connect(mapStateToProps, mapDispatchToProps)(Receipt);