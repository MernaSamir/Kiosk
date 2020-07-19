import React, { Component } from 'react'
import { withRouter } from 'react-router'
import classes from './style.less'

class SignUp extends Component {

    renderFirst = () => {
        return <div className={classes.first}>
            <p>Not Signed Up Yet?</p>
            <p onClick={this.signup.bind()}><u>SIGN UP</u></p>
        </div>
    }

    signup = () => {
        const { history } = this.props
        history.push('/signup')
    }

    renderSecond = () => {
        return <div className={classes.second}>
            <p>Create an account to enjoy a faster<br /> ordering experience.</p>
        </div>
    }

    render() {
        return (
            <div className={classes.signup}>
                {this.renderFirst()}
                {this.renderSecond()}
            </div>
        )
    }
}

export default withRouter(SignUp)