import React, { Component } from 'react'
import { Select } from 'antd';
import { connect } from 'react-redux'
import { ConnectAllApps } from "helpers/functions"
import form_style from 'styles/form_control.less'
import mapDispatchToProps from 'helpers/actions/main'
import { get, map, isEqual, pick } from 'lodash'
import applyFilter from 'helpers/functions/filters';
import { withTranslation } from 'react-i18next';
const Option = Select.Option;
class selectboxClass extends Component {
    handleChange = (value) => {
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
        const { colValue, list, show = { key: 'GetDataSelector', show: 'name' }, t } = this.props
        return map(list, (d, index) => {
            const val = applyFilter(show, d)
            return <Option
                key={index}
                value={get(d, colValue, d.id)}
                style={{ width: '100%' }}
            >
                {t(val)}
            </Option>
        })
    }

    render() {
        const { label, field = {}, mode = "default", t } = this.props
        return (
            // <BasicComponent compare={this.compares}>
                <div>
                    {label ? <div><span className={form_style.text_name}>{t(label)}</span></div> : undefined}
                    <Select
                        onBlur={field.onBlur}
                        defaultValue={field.value ? field.value : ""}
                        mode={mode}
                        placeholder="Please Select"
                        value={field.value}
                        style={{ fontSize: '1vw', display: 'flex', minWidth: '8vw' }}
                        onChange={this.handleChange}
                    >
                        {this.renderOptions()}
                    </Select>
                </div>
            // </BasicComponent>
        )
    }
}
const selectbox = withTranslation()(selectboxClass)
const mapStateToProps = (state, ownProps) => ({
    list: ownProps.options || get(state, `${(ownProps.reduxName)}.data`, {})
})

class select_connector extends Component {
    Component = <div></div>
    constructor(props) {
        super(props);
        this.getComponent(props);
        this.getInit(props);

    }
    shouldComponentUpdate(nextProps, nextState) {
        const { reset_fields = [] } = nextProps
        const reset = reset_fields.map(f => `form.values.${f}`)
        const compare = ['list', 'apis', 'mainValues', 'field.value']
        const su = !isEqual(pick(this.props, compare), pick(nextProps, compare));

        if (su && !nextProps.field.value) {
            this.getInit(nextProps);
        }
        if (!isEqual(pick(this.props, reset), pick(nextProps, reset))) {
            this.resetField(nextProps);
        }
        return !isEqual(this.props, nextProps);
    }


    resetField(props) {
        const { field, mode } = props
        field.onChange({ target: { name: field.name, value: mode == "multiple" ? [] : '' } })
    }
    getInit(nextProps) {
        const { form, init, field, mainValues = form.values } = nextProps;
        if (init) {
            const value = applyFilter(init, mainValues);
            if (value) {
                field.onChange({ target: { name: field.name, value } })
            }
        }
    }
    getComponent = (props) => {
        // const { apis } = this.props
        // let foundReduxName = get(apis, `${props.reduxName}`, {});
        // if(foundReduxName.name){
        ConnectAllApps(this.props, this.props.fetchingApis)
        // }else{
        this.Component = selectbox
        // }
    }
    render() {
        const { field, filter = { key: 'List', select: {} }, form, mainValues = form.values } = this.props;
        const mainValue = field.value || this.mainValue;
        const params = applyFilter({ select: filter.select, key: 'mapSelect' }, {}, mainValues);
        const list = applyFilter(filter, this.props.list, mainValues)
        return (
            <this.Component {...{ ...this.props, mainValue, list }} params={params} />
        )
    }
}
export const select = connect(mapStateToProps, mapDispatchToProps)(select_connector)
export default select;
