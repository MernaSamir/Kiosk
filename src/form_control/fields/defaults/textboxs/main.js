import React, { Component } from 'react'
import { Input } from 'antd'
// import { validate } from './validators';
import form_style from 'styles/form_control.less'
import style from './style.less'
import { withTranslation } from 'react-i18next'

export class text extends Component {
    state = {
        isValid: true
    }
    render() {
        const { field={}, mainValue=field.value, mainChange=field.onChange, placeholder, t, label, sideLabel, disabled, field_type="text" } = this.props
        const pl = t(placeholder)
        return (
            <div>
                {label ? <div><span className={form_style.text_name}>{t(label)}</span></div> : undefined}
                {sideLabel ? <div className={style.cheakGrid}>
                    <div>{t(sideLabel)}</div>
                    <Input
                        value={mainValue}
                        onChange={mainChange}
                        type={field_type}
                        name={field.name}
                        placeholder={pl}
                        style={{ fontSize: '1vw', display: 'flex', width: '100%' }}
                        disabled={disabled}

                    />
                    </div> : <Input
                        type={field_type}
                        value={mainValue}
                        onChange={mainChange}
                        placeholder={pl}
                        name={field.name}
                        style={{ fontSize: '1vw', display: 'flex', width: '100%' }}
                        disabled={disabled}
                    />
                }

            </div>

        )
    }

}
export default withTranslation()(text);
