import React, { Component, Suspense } from 'react'
import * as inputs from './fields';
import { mapValues, set, range, reduce, get, map, omit, isEqual, pick, omitBy, isNull, filter } from 'lodash';
import { Field } from 'formik';
import { connect } from 'react-redux';
import * as Validations from './validation';
import Filters from './fields/filters';
import applyFilter from 'helpers/functions/filters';
import LinkedComponent from 'helpers/components/linked';
import FieldComponent from 'helpers/components/field'
import mapDispatchToProps from 'helpers/actions/main'
import './style.css'

const label = (props) => {
    return <div>{props.type}</div>
}

class FormField extends Component {
    state = {
        field: {},
        form_values: {},
    }
    constructor(props) {
        super(props);
        if (!props.field.value && props.initValue) {
            this.updateInitValue(props)
        }
    }
    updateInitValue(props){
        const {field} = this.props;
        const value = props.initValue.key ? applyFilter(props.initValue):props.initValue
        field.onChange({
            target: {
                name: field.name,
                value: value
            }
        })
    }
    getFilteredData = () => {
        const { filters = {}, field } = this.props;
        const { form_values } = this.state;
        const data = applyFilter(filters.init || {}, field.value);
        const vals = omitBy(form_values.data, (val) => isNull(val))
        const names = map(vals, (d, k) => (k))
        const data_filters = filter(filters.fields, d => (names.includes(d.filter_name)))
        const params = data_filters.map((d) => {
            let o = omit(d, ['name']);
            set(o, `${d.f_path}.${d.filter_name}`, get(vals, d.filter_name))
            return o
        })
        const chaining = reduce(params, ((o, d, k) => (set(o, range(0, k + 1).map(d => 'then').join('.'), d))), {})
        const last = applyFilter(chaining.then || { key: "Filter", path: filters.main_path }, data)
        this.filteredList = applyFilter(filters.post || {}, last);
        return this.filteredList
    }

    FilterChange = (form_values) => {
        this.setState({ ...this.state, form_values })
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { field, dep, mainDep = dep && `form.values.${dep}`, deps = [], 
            full_form_deps=[] } = this.props

        // let new_full_form_deps = full_form_deps ? full_form_deps : get(appSetting, 'full_form_deps', [])
        const name = field.name;
        const value = get(nextProps, 'field.value')
        if(value==null && nextProps.initValue){
            this.updateInitValue(nextProps)
        }
        const fieldDep = deps.map(d => `form.values.${d}`);
        const fullFormDep = full_form_deps.map(d => `fullForm.${d}`)
        const compare = ['tabKey', 'appSetting', 'mainValues', 'mainValue', 'mainForm', "allValues", 'reduxName', mainDep, `form.errors.${name}`, 'field', 'form.submitCount', 'form.initialValues', ...fieldDep, ...fullFormDep].filter(d => d)
        // if(nextProps.initValue && this.props.field.value && !nextProps.field.value)
        return Boolean(field.name != undefined) && !isEqual({ state: this.state, props: pick(this.props, compare) }, { state: nextState, props: pick(nextProps, compare) });
    }
    render() {
        const { field, filters = {}, form, type, pers } = this.props;
        const { form_values } = this.state;
        const MainComponent = get(inputs, type, label);
        const error = get(form.errors, field.name)
        const touch = form.submitCount > 0
        this.getFilteredData()
        const valid = Boolean(applyFilter(get(pers, 'field', {key: "true"}), form.values || {}))
        if(!valid){
            return <></>
        }
        return <section>
            <div>
                {
                    filters.fields && <Filters
                        filters={mapValues(filters.fields, d => ({ ...d, name: `${d.model_name}.${d.filter_name}` }))}
                        filterChange={this.FilterChange.bind(this)}
                    />
                }
                <Suspense fallback={<div></div>}>
                    <LinkedComponent {...this.props}>
                        <FieldComponent {...this.props}>
                            <MainComponent {...this.props} filters_value={form_values} filteredList={this.filteredList}></MainComponent>
                        </FieldComponent>
                    </LinkedComponent>
                </Suspense>

            </div>
            <p style={{ fontSize: '0.8vw', color: 'red' }}>{touch && error}</p>
        </section>

    }
}
class FormControlsRender extends Component {
    constructor(props) {
        super(props)
        this.validations = map(props.validates, (d, key) => (get(Validations, key, false)(d))).filter(Boolean)
        this.state = {
            field: {},
            form_values: {},
        }
    }
    render() {
        const { name, type, ...props } = this.props;
        return <Field validate={this.validation} render={(field) => (

            <FormField {...{ ...props, type, ...field }} />

        )} name={name} />;
    }
}

export default connect((state) => ({
    appSetting: state.apps.active,
    fullForm: state.form
}), mapDispatchToProps)(FormControlsRender)