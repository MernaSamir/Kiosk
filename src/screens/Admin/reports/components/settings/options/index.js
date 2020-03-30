import React, { Component } from 'react'
import classes from './style.less'
import { map } from 'lodash'
import CheckBoxHighlight from 'imports/field/components/check_box/highlight'
const options = [
    { label: 'Sales by Order Mode', name: 'by_mode' },
    { label: "Sales by Menu", name: 'by_menu' },
    { label: "Sales by Department", name: 'by_department' },
    { label: "Sales by Category", name: 'by_category' }
]
class Options extends Component {

    renderOptions() {
        const { handelChange, values, t } = this.props;

        return (map(options, (d) => {
            return (<div>
                <p>{t(d.label)}</p>
                <CheckBoxHighlight field={{
                    name: d.name,
                    onChange: handelChange,
                    value: values.value
                }} />
            </div>)
        }))
    }
    render() {
        const {t}= this.props
        return (
            <div className={classes.options}>
                <p className={classes.title}>{t("Display Options")}</p>
                {this.renderOptions()}
            </div>
        )
    }
}
export default Options

