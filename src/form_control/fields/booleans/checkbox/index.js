import React from 'react'
import InputComponent from 'helpers/components/input'
import { Checkbox, } from 'antd'
import style from './style.less'
import form_style from 'styles/form_control.less'
import { withTranslation } from 'react-i18next'

export class checkbox extends InputComponent {
    onChange = (ev)=>{
        const {field={}, mainChange=field.onChange} = this.props;
        mainChange({target: {name: field.name, value: ev.target.checked}});
    }
    render() {
        const { label, sideLabel, field = {}, mainValue=field.value, className, t } = this.props
        return (
            <div className={form_style.grid_naming}>
                {label ? <div><span className={form_style.text_name}>{t(label)}</span> </div> : undefined}

                {sideLabel ?
                    <div className={style.cheakGrid}>
                        <div>{t(sideLabel)}</div>

                        <Checkbox
                            checked={mainValue}
                            type="checkbox"
                            onChange={this.onChange}
                            name={field.name}
                            // className={className ? className : style.checkBox}

                        />
                    </div>
                    :
                    <Checkbox
                        checked={mainValue}
                        type="checkbox"
                        name={field.name}
                        onChange={this.onChange}
                        className={className ? className : style.checkBox}
                    />
                }
            </div>
        );
    }
}


export default withTranslation()(checkbox)
