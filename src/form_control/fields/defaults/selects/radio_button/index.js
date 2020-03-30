import React from 'react'
import InputComponent from 'helpers/components/input';
import style from './style.less'
import { Radio } from 'antd';
import { map } from 'lodash'
import { withTranslation } from 'react-i18next';

const RadioGroup = Radio.Group;

export class Radiobtn extends InputComponent {
    renderOptions = () => {
        const { options, t } = this.props
        return map(options, (option, index) => {
            return <Radio
                className={style.options}
                value={option.value}
                key={index}
            >
                {t(option.label)}
            </Radio>
        })
    }

    handleChange = (e) => {
        this.onChange(e.target.value)
    }
    render() {

        const { field = {}, mainValue = field.value, label, t } = this.props
        return (
            <div>
                <div className={style.label}>{t(label)}</div>
                <RadioGroup onChange={this.handleChange} value={mainValue}>
                    {this.renderOptions()}
                </RadioGroup>
            </div>
        )
    }
}
export default withTranslation()(Radiobtn);
