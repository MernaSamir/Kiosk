import React, { Component} from 'react'
import classes from  './style.less'
import { Button } from 'antd';
import mapDispatchToProps from 'helpers/actions/main'
import {connect} from 'react-redux';
class errorMsg extends Component {
    Logout = () => {
        const { setMain, history } = this.props;
        localStorage.removeItem('tk');
        setMain({ current: '' })
        history.push('/')
    }
    render () {
        return <div className={classes.contanier}>
            <p >Contact Your Manager To Open (Day/Shift)</p>
            <br />
            <Button onClick={() => this.props.history.push('/admin')} >Go To Admin</Button>
            <Button onClick={this.Logout} >Logout</Button>
        </div>

    }
}

export default connect(null, mapDispatchToProps)(errorMsg)
