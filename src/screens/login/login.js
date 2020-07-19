import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Render from 'helpers/functions/field_mapper/renderfields'
import Form from 'helpers/wrap/form.js';
import { withRouter } from 'react-router'
import { multiRequest } from 'helpers';
import axios from 'axios'
import UserQuery from './user';
import { Modes as Urls } from 'config';
import { get } from 'lodash';
import { message } from 'antd'
import classes from './style.less'

const fields = [
    {
        name: 'username', label: "Mobile ", type: 'TextBox', numPad: true,
        className: get(classes, 'inputs', undefined)
    },
    {
        name: 'password', label: "Password ", type: 'TextBox', field_type: 'password'
        , className: get(classes, 'inputs', undefined), password: true,
        iconstyle: get(classes, 'icon', undefined)
    },
]

class LogIn extends Component {

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
                    console.log(current,'curr')
                    let out = [
                        { type: 'set_main_main', data: { current } },
                        { type: 'set_main_parties__customer', data: { active: current.employee } }
                    ]
                    setAll(out)
                    return current
                })
            })
    }
  
    static onSubmit(props, values) {
        const { history, mode } = props;
        // console.log("GG ", props, values)
        this.handelLogin(props, values).then((res) => {
            const url = 'select_location'
            history.push(url)
        }).catch((err) => {
            message.error("Invalid Credentials")
        })
    }

    render() {
        return (
            <div className={classes.form}>
                {Render(fields)}
                <button> LOG IN</button>
            </div>
        )
    }
}

export default connect((state) => ({
    // ...console.log(state,'ii'),
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    User: state.main.current,
    style: { height: '65%', marginBottom: '2%' }
}), mapDispatchToProps)(withRouter(Form(LogIn)))