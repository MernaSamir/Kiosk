import React, { Component } from 'react'
import { connect } from 'react-redux'
import form_style from 'styles/form_control.less'
import mapDispatchToProps from 'helpers/actions/main'
import { get, map, isEqual, pick } from 'lodash'
import applyFilter from 'helpers/functions/filters';
import BasicComponent from 'helpers/components/basic';
import { withTranslation } from 'react-i18next'
class selectboxClass extends Component {
    handleChange = (ev) => {
        const value = ev.target.value;
        const { field, onSelect } = this.props
        if (onSelect) {
            onSelect(value)
        }
        field.onChange({
            target: {
                name: field.name,
                value
            }
        });
    }

    renderOptions = () => {
        const { colValue, list, show={key: 'GetDataSelector', show: 'name'}, t} = this.props
        return map(list, (d, index) => {
            const val = applyFilter(show, d)
            const value = get(d, colValue, d.id)
            return <option
                key={index}
                value={value}
                style={{ width: '100%' }}
            >
                {t(val)}
            </option>
        })
    }

    render() {
        const { label, field = {}, t } = this.props
        console.log('object',this.props)
        return (
            <BasicComponent compare={this.compares}>
                <div>
                    {label ? <div><span className={form_style.text_name}>{t(label)}</span></div> : undefined}
                    <select
                        placeholder="Please Select"
                        value={field.value}
                        style={{ fontSize: '1vw', display: 'flex', minWidth:'100%' }}
                        onChange={this.handleChange}
                    >
                        {this.renderOptions()}
                    </select>
                </div>
            </BasicComponent>
        )
    }
}
const selectbox = withTranslation()(selectboxClass)
const mapStateToProps = (state, ownProps) => ({
    list: ownProps.options || get(state, `${(ownProps.reduxName)}.data`, {}),
    apis: get(state, 'apps.api', {}),
})

class select_connector extends Component {
    Component = <div></div>
    constructor(props) {
        super(props);
        this.getComponent(props);
        this.getInit(props);
    }
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['list', 'mainValues', 'field.value']
        const su = !isEqual(pick(this.props, compare), pick(nextProps, compare));
        if(su && !nextProps.field.value){
            this.getInit(nextProps);
        }
        return su;
    }
    getInit(nextProps){
        const {form, init, field, mainValues=form.values} = nextProps;
        if(init){
            const value = applyFilter(init, mainValues);
            if(value){
                field.onChange({target: {name: field.name, value}})
            }
        }
    }
    getComponent = (props) => {
        this.Component = selectbox
    }
    render() {
        const {field, filter={key: 'List', select:{}}, form, mainValues=form.values} = this.props;
        const mainValue = field.value || this.mainValue;
        const params = applyFilter({...filter, key: 'mapSelect'}, {}, mainValues);
        const list = applyFilter(filter, this.props.list, mainValues)
        return (
            <this.Component {...{...this.props, mainValue, list}} params={params}  />
        )
    }
}
export const nativeSelect = connect(mapStateToProps, mapDispatchToProps)(select_connector)
export default nativeSelect;
