import React, { Component } from 'react'
import { Input } from 'antd'
// import { validate } from './validators';
import form_style from 'styles/form_control.less'
import style from './style.less'
import { withTranslation } from 'react-i18next'

export class password extends Component {
    state = {
        isValid: true
    }
    render() {

        const { field={}, mainValue=field.value, mainChange=field.onChange, placeholder, t, label, sideLabel, disabled, field_type="text" } = this.props
        const pl = t(placeholder)
        return (
            <div>
                {label ? <span className={form_style.text_name}>{t(label)}</span> : undefined}
                {sideLabel ? <div className={style.cheakGrid}>
                    <div>{t(sideLabel)}</div>
                    <Input.Password 
                        value={mainValue}
                        onChange={mainChange}
                        type={field_type}
                        name={field.name}
                        placeholder={pl}
                        style={{ fontSize: '1vw', display: 'flex', width: '100%' }}
                        disabled={disabled}

                    />
                    </div> : <Input.Password 
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
export default withTranslation()(password);
