import React, { Component } from 'react'
import { DatePicker } from 'antd';
import style from './fields/booleans/checkbox/style.less'

export class Datepicker extends Component {
    state = {
        isValid: true
    }
    handelChange = (value) => {
        const { field: { name, onChange } } = this.props
        onChange({
            target: {
                name,
                value
            }
        })
    }

    render() {

        const { field, placeholder, label, sideLabel } = this.props

        // alert(value)
        return (
            <div>
                {label ? <span className={style.text_name}>{label}</span> : undefined}
                {sideLabel ? <div className={style.cheakGrid}>
                    <div>{sideLabel}</div>
                    <DatePicker
                        value={field.value}
                        onChange={this.handelChange}
                        placeholder={placeholder}
                        style={{ fontSize: '1vw', display: 'flex' }}


                    />
                </div> : <DatePicker
                        value={field.value}
                        onChange={this.handelChange}
                        placeholder={placeholder}
                        style={{ display: 'flex' }}


                    />
                }
            </div>

        )
    }

}
export default Datepicker;
