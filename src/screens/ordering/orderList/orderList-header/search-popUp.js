import React, { Component } from 'react'
import Keyboard from 'components/keyboard'
import classes from './style.less';
export default class HoldOrder extends Component {
    state = {
        currentInput: 'search',
        search: '',
    };
    cancelClick = () => {
        this.props.onCancel();
        this.setState({ search: '' })
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
            this.cancelClick()
        }
        else if (value) {
            obj[key] = this.state[key] + _value;
        }
        this.setState({ ...obj })
    }
    render() {

        return (
            <div className={classes.pop_search_container}>
                <div className={classes.SearchLabelDiv}>
                    <label className={classes.PopUpLabel}>Search Item</label>
                    <input className={classes.SearchInputs}
                        onChange={(event) => this.handelInput("search", event.target.value, event)}
                        onKeyDown={(e) => this.setState({ bacspace: e.keyCode })}
                        value={this.state.search}
                        onClick={() => this.setState({ currentInput: "search" })}
                    />
                </div>

                <Keyboard
                    handelInput={this.handelInput}
                    keyName={this.state.currentInput}
                    visible />

                <div className={classes.ButtonsDiv}>
                    <button className={classes.CancelBtn} onClick={() => this.cancelClick()}>Cancel</button>
                    <button className={classes.OkBtn} onClick={() => this.cancelClick()}>Ok</button>
                </div>
            </div>
        )
    }
}