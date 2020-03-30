import React, { Component } from 'react'
import style from './style.less'
import FormControls from 'form_control'
import { get, map } from 'lodash'
import { withTranslation } from 'react-i18next'
export class group_grid extends Component {
    renderFormField(field) {
        const { tabKey } = this.props
        const tabs = get(field, 'permission.tabs', null);
        if (tabs && !tabs.includes(tabKey)) {
            return <div></div>
        }

        return <FormControls
            {...field}
            name={this.getFieldName(field)}
            tabKey={tabKey}
        />
    }
    getFieldName(f){
        const { field: {name=''} } = this.props
        return [name, f.name].filter(d=>d).join('.')
    }
    renderForm = () => {
        const { group=[], direction } = this.props
        return map(group, (d, index) => {
            return <div 
            key={index} 
            style={{ margin: direction == "column" ? '5% 0' : undefined }}
            className={style.grid_item}
            >
                {this.renderFormField(d)}
            </div>
        })
    }

    render() {
        const { hint, t, grid_temp, grid_gap } = this.props

        let grid = {
            display: 'grid',
            gridTemplate: grid_temp ? `"${grid_temp}"` : "'. . . . .'",
            gridGap: grid_gap ? grid_gap : '1%'
        }
        return (
            <div className={style.group_grid_container} style={grid}>
                {this.renderForm()}
                {hint ? t(hint) : undefined}
            </div>
        );
    }
}


export default withTranslation()(group_grid)
