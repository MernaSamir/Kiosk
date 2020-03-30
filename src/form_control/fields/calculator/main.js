import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get, isEqual, pick, omit } from 'lodash'
import * as calculateFunctions from './functions'
import mapDispatchToProps from 'helpers/actions/main'
import { withTranslation } from 'react-i18next'

export class calculator extends Component {
    constructor(props) {
        super(props);
        this.calc(props)
    }
    calc(props) {
        const { allValues, field, mainValue = field.value, params, func, main_data,
             totalChange = field.onChange, fullForm, mainForm = this.props.form, setPath, 
             totalCal, total,appendPath } = props
        let calculations = get(calculateFunctions, func, () => 0)(params, { allValues, form: mainForm, fullForm}, main_data, field, appendPath)
        if (mainValue != calculations && calculations!=null) {
            totalChange({ target: { value: calculations, name: field.name } })
            this.value = calculations;
            total && setPath('form', total.replace('form.', ''), totalCal + calculations)
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        const calc = ['field', 'form', "allValues", "mainForm", "params", "func", "main_data", "fullForm"]
        const exclude = ['']
        const su = !isEqual({ porps: pick(omit(nextProps, exclude), calc) }, { props: pick(omit(this.props, exclude), calc) })
        if (su) {
            this.calc(nextProps);
        }
        const compare = [...calc, 'mainValue']
        return !isEqual({ props: pick(this.props, compare) }, { props: pick(nextProps, compare) })
    }
    render() {
        const { field,label, mainValue = field.value, t } = this.props;
        return (
            <div>
                {label && <label> {t(label)} </label>}
                {this.value}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    fullForm: get(state, 'form'),
    totalCal: get(state, props.total, 0)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(calculator))
