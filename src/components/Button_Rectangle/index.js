import React, { Component } from 'react'
import styleLess from './style.less'
import { withTranslation } from 'react-i18next'

export class Button_Rectangle extends Component {
    render() {
        const { name="Text", onClick, styleprops, visiable=false, t } = this.props

        return (
            <button
                visiable={visiable}
                onClick={onClick}
                className={styleprops ? styleLess[styleprops] : styleLess.defult}
            >
                {t(name)}
            </button>
        )
    }
}
export default withTranslation()(Button_Rectangle)
