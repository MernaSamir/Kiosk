import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash'
import { message } from 'antd';
import {withTranslation} from 'react-i18next'

class Button extends Component {

    startProvider = () => {
        const { setMain, order } = this.props
        if (order) {
            message.warning('Please Select Customer First')
        }
        else {
            const popup = {
                type: 'ServiceProvider', visable: true, width: "70%",
                childProps: {
                }
            }
            setMain('popup', { popup })
        }
    }
    render() {
        const { className, mode, t } = this.props
        const showSP = mode.key == 'CC'
        if (!showSP) {
            return <></>
        }
        return (
            <button className={className} onClick={this.startProvider}>{t('Service Provider')}</button>
        )
    }
}

export default  withTranslation() (connect((state) => ({
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    station: get(state.licensing__station.data, state.licensing__station.active, {}),
    order: state.orders__main.active,
    // sps: state.dropdowns__delivery_service.data,
    // location: state.licensing__location.active,
}), mapDispatchToProps)(Button) )
