import React, { Component } from 'react'
import classes from '../style.less'
import mapDispatchToProps from 'helpers/actions/main'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom';
import { Modes as urls } from 'config'
import {get} from 'lodash';
class ActionButton extends Component {
    app = "orders__shifts"
    handleSuccess = (data) => {
        const {history, mode, app} = this.props;
        const url = get(urls, mode.key)
        history.push(url)
        return [
            {type: `set_path_${app}`, path: 'active', data: data.id}
        ]

    }

    handleClick = () => {
        const { setMain, shift, business_day } = this.props;
        const app = this.app;
        if (shift) {
            return setMain(app, {item:{
                id: shift,
                action: 'update',
                end_time: new Date(),
                onSuccess(){
                    return [
                        {type: `set_path_${app}`, path: 'active', data: ''}
                    ]
                }
            }})
        }
        else {
            return setMain(app, {item:{
                date: business_day,
                action: 'add',
                start_time: new Date(),
                onSuccess: this.handleSuccess
            }})
        }
    }

    changeBorder = (id) => {
        let style = 'solid 1px rgba(112, 112, 112, 0.46)'
        if (id)
            return style = 'solid 1px #d73f7c'
        return style
    }

    changeColor = (id) => {
        let color = '#000000'
        if (id)
            return color = '#d73f7c'
        return color
    }

    render() {
        const { shift, business_day , t } = this.props
        const disabled = !business_day;
        return (
            <button type="button" className={classes.btn} onClick={this.handleClick}
                style={{
                    opacity: disabled ? '0.3' : '1',
                    border: this.changeBorder(shift),
                }} disabled={disabled}>
                <p style={{ color: this.changeColor(shift) }}>
                    {t(`${shift ? "End" : "Start"} Shift`)}
                </p>
            </button>
        )
    }
}

export default connect((state)=>({
    shift: state.orders__shifts.active,
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    business_day: state.orders__business_days.active
}), mapDispatchToProps)(withRouter(ActionButton))
