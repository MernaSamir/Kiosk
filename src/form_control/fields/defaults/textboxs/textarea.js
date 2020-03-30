import React, { Component } from 'react'
import { Input } from 'antd'
import form_style from 'styles/form_control.less'
import style from './style.less'
import { withTranslation } from 'react-i18next';
const { TextArea } = Input;

export class textArea extends Component {

    render() {

        const { placeholder, t, label, sideLabel, field } = this.props
        const pl = t(placeholder)
        // alert(value)
        return (
            <div>
                {label ? <span className={form_style.text_name}>{t(label)}</span> : undefined}
                {sideLabel ? <div className={style.cheakGrid}>
                    <div>{t(sideLabel)}</div>
                    <TextArea rows={4}
                        {...field}
                        placeholder={pl}
                        style={{ fontSize: '1vw', display: 'flex' }}


                    />
                </div> : <TextArea rows={4}
                        {...field}
                        placeholder={pl}
                        style={{ fontSize: '1vw', display: 'flex' }}


                    />
                }
            </div>

        )
    }

}
export default withTranslation()(textArea);
