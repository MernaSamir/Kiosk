import React, { Component } from 'react'
import FormControls from 'form_control'
import style from './style.less'
import { map } from 'lodash'
import { withTranslation } from 'react-i18next'

export class display_table extends Component {

    renderHeaders = () => {
        const { components, t } = this.props
        return map(components, (component, i) => {
            return <th key={i}>{t(component.head)}</th>
        })
    }

    renderBody = () => {
        const { components, handleChange } = this.props
        return map(components, (component, i) => {
            return <td key={i}>
                <FormControls
                    onChange={handleChange}
                    {...component}
                    name={this.getFieldName(component)}

                />
            </td>
        })
    }

    getFieldName(f){
        const { field: {name=''} } = this.props
        return [name, f.name].filter(d=>d).join('.')
    }

    render() {
        return (
            <table className={style.table}>
                <thead>
                    {this.renderHeaders()}
                </thead>
                <tbody>
                    {this.renderBody()}
                </tbody>
            </table>
        )
    }
}


export default withTranslation()(display_table)
