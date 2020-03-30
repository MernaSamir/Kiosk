import React, { Component } from 'react'
import Image from "assets/images/logo.png"
import axios from 'axios'
import classes from './style.less'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Render from 'helpers/functions/field_mapper/renderfields'
import Form from 'helpers/wrap/form.js';
import { message } from 'antd'
import { multiRequest } from 'helpers';
import UserQuery from './user';
import { get } from 'lodash';
import { Modes as Urls } from 'config';
import applyFilters from 'helpers/functions/filters';

const controls = [
    {
        name: 'username', label: "User ", type: 'TextBox',
        validates: { required: true }
    },
    {
        name: 'password', label: "Password ", type: 'TextBox', field_type: 'password',
        validates: { required: true }
    },
]
class LogIn extends Component {
    state = {
        error_msg: ''

    }
    static handelLogin(props, values) {
        localStorage.removeItem('tk')
        const { setAll } = props;
        return axios
            .post(`/api/v1/login/`, values)
            .then(({ data }) => {
                // store token to localstorage
                localStorage.setItem('tk', data.token);
                return multiRequest(UserQuery(data.token)).then((data) => {
                    const current = get(data, 'auths__user[0]', null)
                    let out = [{
                        type: 'set_main_main', data: {current}
                    }]
                    const cash_settlements = applyFilters({
                        key: 'Filter',
                        params: {
                            cashier: current.id,
                            _type: 'DE'
                        },
                        then: {
                            key: 'Last'
                        }
                    }, data.financials__cash_settlement)
                    if (cash_settlements && cash_settlements.updated_at > current.pre_login) {
                        out = [...out, ...this.openpop(props, cash_settlements)]
                    }
                    setAll(out)
                    return current
                })
            })
    }
    static openpop(props,cash_settlements) {
        const popup = {
            type: 'Save', visable: true, width: "60%",
            childProps: {
                icon: "info",
                msg: `You have been recieved ${cash_settlements.amount}`
            }
        }
        return [{
            type: 'set_main_popup',
            data: { popup }
        }]
    }

    static onSubmit(props, values) {
        const { history, mode } = props;
        this.handelLogin(props, values).then((res) => {
            const url = get(Urls, mode.key, '/home')
            history.push(url)
        }).catch((err) => {
            message.error("Invalid Credentials")
        })
    }

    render() {
        const { error_msg } = this.state;
        return (
            <div className={classes.login_container}>
                <div className={classes.empty_login}></div>
                <div className={classes.empty_login}></div>
                <div className={classes.logo}>
                    <img className={classes.logo_img} src={Image} />
                </div>
                <div className={classes.empty_login}></div>

                <div className={classes.input_tag}>
                    <div className={classes.inputs}>
                        {Render(controls, { onClick: this.selectInput })}
                    </div>

                </div>
                <h4 className={classes.error_msg}>{error_msg}</h4>
                <br></br>

            </div>
        )
    }
}

export default connect((state) => ({
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    User: state.main.current
}), mapDispatchToProps)(Form(LogIn))
