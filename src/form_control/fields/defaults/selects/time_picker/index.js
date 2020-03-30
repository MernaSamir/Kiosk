import React from 'react'
import InputComponent from 'helpers/components/input';
import { TimePicker } from 'antd';
import moment from 'moment';
import { withTranslation } from 'react-i18next';



export class timePicker extends InputComponent {

    handleChagne = (time, timeString) => {
        const { fromat } = this.props
        let format_ = fromat ? fromat : 'HH:mm';
        const formatDate = moment(time).format(format_)
        this.onChange(formatDate)
    }

    render() {
        const { field, label, fromat, t } = this.props
        let format_ = fromat ? fromat : 'HH:mm';
        return (
            <div>
                {label ? <p>{t(label)}</p> : undefined}
                <TimePicker
                    value={field.value ? moment(field.value, format_) : null}
                    onChange={this.handleChagne}
                    format={format_}
                />
            </div>
        )
    }
}



export default withTranslation()(timePicker)
