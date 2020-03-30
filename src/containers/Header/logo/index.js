import React, { Component } from 'react'
import style from './style.less'
import logo from 'assets/images/logo_app.png'
import {withRouter} from 'react-router-dom'
import { get } from 'lodash';
import { Modes as urls } from 'config';

class index extends Component {
    goHome = ()=>{
        const { history, shift, mode } = this.props;
        if(shift){
            history.push(get(urls, mode.key))
        }
    }
    render() {
        return (
            <div onClick={this.goHome} className={style.header_logo}>

                <img className={style.logo_img} src={logo} />
            </div>
        )
    }
}

export default withRouter(index)