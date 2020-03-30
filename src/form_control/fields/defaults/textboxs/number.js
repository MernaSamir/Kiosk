import React, { Component } from 'react'
import { InputNumber } from 'antd'
import form_style from 'styles/form_control.less'
import style from './style.less'
import {get, dropRight} from 'lodash'
import { withTranslation } from 'react-i18next'


class InputnumberC extends Component {

    constructor(props){
        super(props)
    }
    handelChange = (value) => {
        const { field={}, mainChange=field.onChange } = this.props
        mainChange({
            target: {
                name: field.name,
                value
            }
        })
    }

    getDefaultValue = () => {
        const {field, form, default_value} = this.props
        let field_name = [...dropRight(get(field, 'name', '').split('.')), default_value].join(".")
        return get(form , `values.${field_name}`)
    }
    
    render() {
        const { label, sideLabel, field = {}, placeholder, t, mainValue=field.value, default_value, mainValues={} } = this.props
        const pl = t(placeholder)
        let val = (!mainValue && default_value )? get(mainValues,`${default_value}`) : null
        if(default_value && !val) {
            val = this.getDefaultValue()
        }
        if(!mainValue && val) {
            this.handelChange(val)
        }
        return (<div>
            {label ? <span className={form_style.text_name}>{t(label)}</span> : undefined}

            {sideLabel ? <div className={style.cheakGrid}>
                <div>{t(sideLabel)}</div>
                <InputNumber
                    placeholder={pl}
                    onChange={this.handelChange}
                    value={mainValue}
                    style={{ fontSize: '1vw', display: 'flex' ,  width: '100%'}}
                    min={this.props.min}
                    max={this.props.max}
                />
            </div> : <InputNumber
                    placeholder={pl}
                    onChange={this.handelChange}
                    value={mainValue}
                    style={{ fontSize: '1vw', display: 'flex' ,  width: '100%'}}
                    min={this.props.min}
                    max={this.props.max}
                />
            }

        </div>
        )
    }
}


export const number = InputnumberC;
export default withTranslation()(number);
