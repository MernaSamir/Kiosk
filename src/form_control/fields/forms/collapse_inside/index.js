import React, { Component } from 'react'
import { Collapse } from 'antd';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { map, get } from 'lodash'
import style from './style.less'
import FormControls from 'form_control'
import { withTranslation } from 'react-i18next';

const Panel = Collapse.Panel;

class collapseClass extends Component {

    renderPanels = () => {
        const { field, t } = this.props
        return <Panel header={t(field.name)} className={style.customPanelStyle}>
            {this.renderItems(field.name)}
        </Panel>

    }

    renderItems = (mod) => {
        const { onChange, collapse_fields } = this.props

        return map(collapse_fields, (field, i) => {
            return <div className={style.function_row} key={i}>
                {/* <p>{func.name}</p> */}
                <FormControls
                     {...field}
                     values={this.state}
                     onChange={onChange}
                />
            </div>
        })
    }

    getFieldName = (v, f) => {
        return [v.id, f.name].filter(d => d).join('.');
    }

    render() {
        return (
            <Collapse accordion>
                {this.renderPanels()}
            </Collapse>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    modules: get(state, `${ownProps.modules}.data`, {}),
    functions: get(state, `${ownProps.functions}.data`, {}),
})

export const collapse_inside = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(collapseClass))
export default collapse_inside;