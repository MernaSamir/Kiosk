import React, { Component } from 'react'
import Image from "assets/images/logo.png"
import classes from './style.less'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
class modifier extends Component {
 
 handelstart =()=>{
    const { history } = this.props;
    history.push('/setting')
}

    render() {
        return (
            <div>
                modifers
            </div>
        )
    }
}
export default modifier;

