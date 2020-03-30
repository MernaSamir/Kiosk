import React from 'react'
import InputComponent from 'helpers/components/input';
import { DatePicker } from 'antd';
import moment from 'moment';
import form_style from 'styles/form_control.less'
import { withTranslation } from 'react-i18next';

class datePicker extends InputComponent {

    handleChagne = (date, dateString) => {
        const formatDate = date ? moment(date).format():''
        this.onChange(formatDate)
    }

    render() {
        const { field, label, default_today, t } = this.props
        return (
            <div>
                {label ? <div><span className={form_style.text_name}>{t(label)}</span></div> : undefined}
                <DatePicker
                    value={field.value ? moment(field.value) : default_today ? moment(new Date()) : null}
                    onChange={this.handleChagne}
                />
            </div>
        )
    }
}



export default withTranslation()(datePicker)
