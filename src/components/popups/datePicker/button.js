import React, { Component } from 'react'
import {withTranslation} from 'react-i18next'

 class buttonO extends Component {
    render() {
        const { b, handleButtons , t } = this.props
        return (
            <button value={b.value} onClick={() => handleButtons(b.value)}>
                {t(b.name)}
            </button>
        )
    }
}
export default withTranslation()(buttonO)