import React, { Component } from 'react'
import { Formik } from "formik";
import { connect } from 'react-redux'
import { get, pick, isEqual } from 'lodash'
import applyFilters from 'helpers/functions/filters';
import LayoutComponent from './layout_container';
import { isEmpty, isArray } from 'lodash'
import { difference } from 'helpers/functions'
import { array_to_obj } from 'helpers/functions';
export class layout_formik extends Component {

    saveData = (values) => {
        const { handleChange, name, index, layout } = this.props;
        let mainValues = values;
        if(!layout.full_save){
            mainValues = difference(values, this.initialValues)
        }
        values = applyFilters(layout.concat || {}, mainValues);
        handleChange({ target: { name: index + 1, value: { name, values } } })
    }
    constructor(props) {
        super(props);
        this.getInitalValues(this.props, this.state);
        //console.log('render')
    }
    shouldComponentUpdate(nextProps, nextState) {
        const full_form_compare = get(nextProps, 'layout.full_form_deps', []).map(dep => `fullForm.${dep}`)
        const compare = ['activeItem', `state.${nextProps.layout.reduxName}`, 'appSetting', ...full_form_compare, 'show'];
        const su = !isEqual(pick(this.props, compare), pick(nextProps, compare))
        if (su) {
            this.getInitalValues(nextProps, nextState);
        }
        return su
    }
    getInitalValues(nextProps) {
        const { layout, fullForm } = nextProps;
        const init = get(layout, 'init', { key: 'Selector', path: `${layout.reduxName}.active` })
        const data = get(nextProps.state, `${layout.reduxName}.data`, {});

        if (!isEmpty(data)) {

            this.initialValues = applyFilters({
                path: `${layout.reduxName}.active`, ...init
            }, data, nextProps.state, layout)



            if (isArray(this.initialValues)) {
                this.initialValues = array_to_obj(this.initialValues);
            }
            if (init.init_filter) {
                const { filter_field_name } = init.init_filter
                const filter_values = get(fullForm, filter_field_name, []);
                this.initialValues = pick(this.initialValues, filter_values)
            }

        } else {
            this.initialValues = {}
        }

    }
    render() {
        const { layout, index, tabKey, submitFullForm, show='true' } = this.props
        let boShow = !layout.show
        if(!boShow){
            show ? boShow = (show === "true") : boShow = true
        }
        return (
            <>
                {boShow && <Formik onSubmit={this.saveData} initialValues={this.initialValues} enableReinitialize={true} >
                    {(props) => (
                        <LayoutComponent {...{ ...props, layout, index, tabKey, submitFullForm }} />
                    )}

                </Formik>}
            </>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        state: state,
        appSetting: get(state, 'apps.active', {}),
        fullForm: get(state, 'form'),
        show: get(state, `${ownProps.layout.show}`, undefined)
    }
}

export default connect(mapStateToProps)(layout_formik)
