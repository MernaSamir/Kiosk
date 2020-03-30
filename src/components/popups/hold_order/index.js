import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import {withTranslation} from 'react-i18next'

class HoldOrder extends Component {
    state = {
        currentInput: 'Note',
        Note: '',
    };
    cancelClick = () => {
        this.props.onCancel();
        // this.setState({ Note: '' })
    }
    okClick = () => {
        const {activeOrder,setMain} = this.props
        setMain("orders__main", {
            active: activeOrder.id,
            item: {
                id: activeOrder.id, 
                hold_time: new Date(), 
                call_name:Note, 
                action: 'update', 
                onSuccess: this.finishUpdate
            }
        })
    }
    finishUpdate = ()=>{
        this.cancelClick()
        return [{
            type: 'set_main_orders__main',
            data: {active: ''}
        }]
    }

    handelInput = (key, value, event) => {
        var obj = {};

        let _value = '';
        if (event) {
            _value = event.target.value.slice(-1);
        } else {
            _value = value
        }
        if (_value == '{bksp}' || this.state.bacspace == 8) {
            obj[key] = this.state[key].slice(0, -1);
        } else if (_value == '{space}') {
            obj[key] = this.state[key] + ' ';
        } else if (_value == 'clear') {
            obj[key] = ''
        }
        else if (_value == '{enter}') {
            obj[key] = this.state[key] + '\n';
        }
        else if (value) {
            obj[key] = this.state[key] + _value;
        }
        this.setState({ ...obj })
    }
    render() {
        const { activeOrder , t} = this.props
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'flex-center', textAlign: 'center' }}>
                    <label className="popUpHeader">{t("Hold Order")} # {activeOrder.num}</label>
                </div>

                <table className="NoteLabelDiv">
                    <tbody>
                        <tr>
                            <td><label className="PopUpLabel">{t("Call name or Notes")}</label></td>
                            <td> <textarea className="TextArea"
                                onChange={(event) => this.handelInput("Note", event.target.value, event)}
                                onKeyDown={(e) => this.setState({ bacspace: e.keyCode })}
                                value={this.state.Note}
                                onClick={() => this.setState({ currentInput: "Note" })}
                            /></td>
                        </tr>
                    </tbody>
                </table>

                <div className="ButtonsDiv">
                    <button className="CancelBtn" onClick={() => this.cancelClick()}>{t("Cancel")}</button>
                    <button className="OkBtn" onClick={() => this.okClick()}>{t("Ok")}</button>
                </div>
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(withTranslation()(HoldOrder))
