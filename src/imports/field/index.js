import React, { Component, Suspense } from 'react'
import { Field } from 'formik';
import * as InputComponnets from './components/types';
import ErrorMessage from './components/error_message'
import * as Validations from './validation'
import { withTranslation } from 'react-i18next';
import { get, map, isEqual } from 'lodash';

class FieldComponent extends Component {

  constructor(props) {
    super(props);
    if (!props.field.value && props.initValue) {
      this.updateInitValue(props.initValue)
    }
  }
  updateInitValue(value){
    const {field} = this.props;
    field.onChange({
      target: {
        name: field.name,
        value: value
      }
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(!isEqual(this.props.initValue, nextProps.initValue)){
      this.updateInitValue(nextProps.initValue)
    }
    return !isEqual({props: this.props, state: this.state}, {props: nextProps, state: nextState})
  }
  

  render() {
    const Component = get(InputComponnets, this.props.type, InputComponnets.TextBox);
    const { form, field, t } = this.props;
    const required = get(this.props, 'validates.required', false) ? '*' : ''
    return (
      <>
        <label >{`${t(get(this.props, 'label', ''))} ${required}`}</label>
        <Suspense fallback={<div>...loading</div>}>
          <Component className={this.props.className} {...this.props}></Component>
        </Suspense>
        <ErrorMessage touched={get(form, `touched.${field.name}`, form.submitCount > 0)} error={get(form, `errors.${field.name}`)}></ErrorMessage>
      </>
    )
  }
}

class FieldControl extends Component {

  constructor(props) {
    super(props)
    this.validations = map(props.validates, (d, key) => (get(Validations, key, false)(d))).filter(Boolean)
  }

  validation = (value) => {
    value = (value == null) ? '' : value
    const valid = this.validations.reduce((o, k) => (o || k(value)), undefined)
    return valid;
  }

  render() {
    return (
      <Field component={FieldComponent} {...this.props} validate={this.validation} />
    )
  }
}

export default withTranslation()(FieldControl)