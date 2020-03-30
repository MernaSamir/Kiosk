import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BtnStyle from './radio.less'
// import Input from '../dates/input'

export class Radio extends Component {



    handleClick = () => {

        const { name, onChange } = this.props
        onChange(name)

    }
    render() {

        const { clicked, name } = this.props
        return (
            <div
                className={clicked == true ? BtnStyle.dates_btnn : BtnStyle.dates_btn}
                onClick={() => this.handleClick(1)}
            >
                {
                    clicked == true ?
                        <FontAwesomeIcon className={BtnStyle.iconstyle}
                            icon="stop-circle" />
                        :
                        <FontAwesomeIcon className={BtnStyle.dates_circle1} icon="circle" />
                }
                <text className={clicked == true ? BtnStyle.dates_text :  BtnStyle.dates_text} >{name}</text>
            </div>
        )
    }
}

export default Radio