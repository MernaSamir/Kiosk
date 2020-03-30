import React, { Component } from 'react'
import { Collapse } from 'antd';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { map, get, filter, isEmpty } from 'lodash'
import style from './style.less'
import FormControls from 'form_control'
import { withTranslation } from 'react-i18next';

const Panel = Collapse.Panel;

class collapseClass extends Component {

    renderPanels = () => {
        const { modules, t } = this.props
        if (!isEmpty(modules)) {
            return map(modules, (mod, i) => {
                return <Panel header={t(mod.name)} key={i} className={style.customPanelStyle}>
                    {this.renderItems(mod.id)}
                </Panel>
            })
        }
        else {
            return this.renderItems('')
        }
    }

    renderItems = (mod) => {
        const { onChange, functions, filedProps, modules, t } = this.props
        let filtered_functions = []
        if (!isEmpty(modules)) {
            filtered_functions = filter(functions, { module: mod })
        } else { filtered_functions = functions }
        return map(filtered_functions, (func, i) => {
            return <div className={style.function_row} key={i}>
                <p>{t(func.name)}</p>
                <FormControls
                    {...filedProps}
                    name={this.getFieldName(func, filedProps)}
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

export const collapse = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(collapseClass))
export default collapse;