import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { renderAsterisk } from 'form_control/validation'
import mgStyle from './style.less'
import {get} from 'lodash'
class Header extends Component {
    render() {
        const {t, field} = this.props
        return (
            <th className={mgStyle.header_td}>
                {t(field.head)}{renderAsterisk(get(field, 'validates', {}))}
            </th>
        )
    }
}

export default withTranslation()(Header)