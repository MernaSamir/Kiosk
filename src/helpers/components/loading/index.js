import React, { Component } from 'react'
import { Spin } from 'antd';
import style from './style.less'
import Image from "assets/images/logo.png"

export default class loading extends Component {
    render() {
        return (
            <div className={style.container}>
                <img src={Image} />
                <Spin size="large" />
                <p>
                    Loading...
                </p>
            </div>
        )
    }
}
