import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BtnStyle from './btn-style.less'
import { withTranslation } from 'react-i18next'
// import Input from '../dates/input'

export class ButtonComponent extends Component {



    handleClick = () => {
        const { value ,onChange } = this.props
        onChange(value)
    }
    render() {

        const { clicked, label, t } = this.props
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
                <text className={clicked == true ? BtnStyle.dates_text :  BtnStyle.dates_Customize_Annually} >{t(label)}</text>
            </div>
        )
    }
}

export default withTranslation()(ButtonComponent)