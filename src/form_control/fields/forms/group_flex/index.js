import React, { Component } from 'react'
import style from './style.less'
import FormControls from 'form_control'
import { withTranslation } from 'react-i18next'

export class group_flex extends Component {

    renderForm = () => {
        const { group, onChange, direction, margin } = this.props
        return (group || []).map((d, index) => {
            return <div key={index} style={{ margin: direction == "column" ? margin ? margin : '5% 0' : undefined }}>
                <FormControls
                    {...d}
                    name={this.getFieldName(d)}
                    values={this.state}
                    onChange={onChange}
                />
            </div>
        })
    }
    getFieldName(f){
        const { field: {name=''} } = this.props
        return [name, f.name].filter(d=>d).join('.')
    }

    render() {
        const { direction, hint, header, t } = this.props
        let flex = {
            display: 'flex',
            flexDirection: direction ? direction : 'row',
            justifyContent: 'space-around'
        }

        return (
            <div className={style.group_grid_container} style={flex}>
                {header ? t(header) : undefined}
                {this.renderForm()}
                {hint ? t(hint) : undefined}
            </div>
        );
    }
}


export default withTranslation()(group_flex)
