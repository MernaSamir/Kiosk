import React, { Component } from 'react'
import form_style from 'styles/form_control.less'
import { find, get } from 'lodash'
import moment from 'moment';
import { withTranslation } from 'react-i18next';

export class DisplayValue extends Component {


    renderValue = () => {
        const { field, options, timeStampe, format, mainValue = field.value } = this.props
        if (options) {
            let show = find(options, { value: mainValue })
            return get(show, 'key', '')
        } else if (timeStampe) {
            const formatDate = moment(mainValue).format(format || 'DD-MM-YYYY HH:mm')
            return formatDate
        }
        else { return mainValue }
    }

    render() {
        const { label = undefined, style = {}, t } = this.props
        return (
            <div>
                <span className={form_style.displayText} style={style}>
                    {t(label)}
                    <span >{t(this.renderValue())} </span>
                </span>
            </div>

        )
    }

}
export default withTranslation()(DisplayValue);
