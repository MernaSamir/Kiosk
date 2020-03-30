import * as React from 'react';
import RepoteBtn from './btn';
import { withTranslation } from 'react-i18next';

export class dates extends React.Component {

    onChange = (value) => {

        const { onChange, name } = this.props.field
        onChange({
            target: {
                name,
                value
            }
        })

    }

    renderGroup = () => {

        const { value } = this.props.field

        const { list, t } = this.props
        return (list || []).map((d, index) => {
            return <RepoteBtn
                key={index}
                label={t(d.label)}
                value={value}
                clicked={value == d.value}
                onChange={() => this.onChange(d.value)}
            />
        })
    }

    componentDidMount() {
        const { list } = this.props
        const { onChange, name } = this.props.field
        let defaultValue = (list || []).find(d => d.value)
        if (defaultValue) {
            onChange({
                target: {
                    name,
                    value: defaultValue.value
                }
            })
        }

    }
    render() {
        return (
            <div>
                {this.renderGroup()}
            </div>
        );
    }
}

export default withTranslation()(dates);
