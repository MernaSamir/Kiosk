import React, { Component } from 'react';
import mapDispatchToProps from 'helpers/actions/main';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom'
import applyFilters from 'helpers/functions/filters'
import {withTranslation} from 'react-i18next'
let send = false;
class Action extends Component {
    // send = false;
    constructor(props) {
        super(props);
        send = false
    }
    addReceipts = () => {
        const { receipts } = this.props;
        if (!send) {
            send = true
            applyFilters({
                key: 'SavingReceipts',
            }, receipts, undefined, { finish: this.closePopup, print: !window.cordova })
        }
        // setMain('orders__details',{orderPopup:''})
    }
    closePopup = () => {
        const { setAll, history, goto } = this.props;
        send = true
        setAll([
            { type: 'set_main', app: 'popup', data: { popup: {} } },
            { type: 'set_main', app: 'orders__details', data: { orderPopup: '' } },
            // { type: 'set_main', app: 'orders__receipt', data: { seat_num: '' } }
            
        ])
        if(goto){
            return history.push(goto)
        }
        return []
    }
    render() {
        const { t } = this.props
        return (
            <>
                <button type="button" onClick={this.closePopup}>
                    {t('Cancel')}
                </button>
                <button type="button" onClick={this.addReceipts}>
                    {t('Print')}
              </button>
            </>
        );
    }
}
const mapStateToProps = (state) => ({
    receipts: get(state.popup, 'popup.receipts', {}),
    goto: get(state.popup, 'popup.goto', undefined)
})
export default withTranslation() (withRouter(connect(mapStateToProps, mapDispatchToProps)(Action)));
