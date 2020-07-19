import React, { Component } from 'react'
import { withRouter } from 'react-router';
import LogIn from './login';
import SignUp from './signup';
import Logo from 'assets/images/logo.png'
import classes from './style.less'

class Login extends Component {

    renderLogo = () => {
        return <div className={classes.logo}>
            <img src={Logo} />
        </div>
    }

    renderContinue = () => {
        return <div className={classes.continue}>
            <p onClick={this.continue.bind()}>Continue without login</p>
        </div>
    }

    continue = () => {
        const { history } = this.props
        history.push('/home')

    }

    render() {
        return (
            <div className={classes.container}>
                {this.renderLogo()}
                <div className={classes.container}>
                    <LogIn />
                    <SignUp />
                </div>
                {this.renderContinue()}
            </div>
        )
    }
}

export default withRouter(Login)