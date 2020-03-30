import React, { Component } from 'react'
import classes from '../style.less'
import Render from 'helpers/functions/field_mapper/renderfields'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withTranslation } from 'react-i18next';
import {get} from 'lodash'

// var controls = (customer)=>(
//   [
//   {
//     name: 'basic.title', label: "Title", type: 'SelectA', className: classes.Select,
//     app: {
//       name: 'parties__title',
//     },
//   },
//   {
//     name: 'basic.first_name', label: "Customer Name", type: 'TextBox',
//     validates: { required: true, noSpecialChar: '', maxLength: '20' }
//   },
//   {
//     name: 'basic.middle_name', label: "Middle Name", type: 'TextBox',
//     validates: { maxLength: '20' }

//   },
//   {
//     name: 'basic.last_name', label: "Last Name", type: 'TextBox',
//     validates: { required: true, noSpecialChar: '', maxLength: '20' }
//   },
//   {
//     name: "basic.is_male", label: "Gender", type: 'SelectA', className: classes.Select, options: [
//       { id: false, name: 'F' },
//       { id: true, name: 'M' },],

//   },
//   { name: "basic.customer_code", label: "Customer Code", type: 'TextBox' },
//   {
//     name: 'basic.discount_group', label: "Discount Group", type: 'SelectA', className: classes.Select,
//     app: { name: 'parties__customer_group', }
//   },
//   {
//     name: 'basic.credit_group', label: "Credit Group", type: 'SelectA', className: classes.Select,
//     app: { name: 'payment__credit_groups', }
//   },
//   { name: 'basic.job_title', label: "Job Title", type: 'TextBox', },
//   { name: 'basic.organization_name', label: "Organization", type: 'TextBox' },

// ]).map(d => ({ ...d, submitting: false }))

let controls =
  [
  {
    name: 'basic.title', label: "Title", type: 'SelectA', className: classes.Select,
    app: {
      name: 'parties__title',
    },
  },
  {
    name: 'basic.first_name', label: "Customer Name", type: 'TextBox',
    validates: { required: true, noSpecialChar: '', maxLength: '20' }
  },
  {
    name: 'basic.middle_name', label: "Middle Name", type: 'TextBox',
    validates: { maxLength: '20' }

  },
  {
    name: 'basic.last_name', label: "Last Name", type: 'TextBox',
    validates: { required: true, noSpecialChar: '', maxLength: '20' }
  },
  {
    name: "basic.is_male", label: "Gender", type: 'SelectA', className: classes.Select, options: [
      { id: false, name: 'F' },
      { id: true, name: 'M' },],

  },
  { name: "basic.customer_code", label: "Customer Code", type: 'TextBox' },
  
  
  { name: 'basic.job_title', label: "Job Title", type: 'TextBox', },
  { name: 'basic.organization_name', label: "Organisation", type: 'TextBox' },

]
const OrganizationControls = [
  {
    name: 'basic.first_name', label: "Organisation Name", type: 'TextBox',
    className: classes.organName,
    validates: { required: true, noSpecialChar: '', maxLength: '20' }
  },
  {
    name: "basic.customer_code", label: "Customer Code", type: 'TextBox',
    validates: { required: true, noSpecialChar: '', maxLength: '10' }

  },

  { name: 'basic.job_title', label: "Job Title", type: 'TextBox', },
  { name: 'basic.org_name', label: "Organisation", type: 'TextBox' }
]
const groups = [{
  name: 'basic.discount_group', label: "Discount Group", type: 'DataDisplay', 
  app: { name: 'parties__customer_group'}, show: {
    key: 'chain',
    selectors: {
      parties__customer_group: `basic.discount_group`,
       
    },
    dispaly: 'name'
}
},{
  name: 'basic.credit_group', label: "Credit Group", type: 'DataDisplay', 
  app: { name: 'payment__credit_groups'}, show: {
    key: 'chain',
    selectors: {
      payment__credit_groups: `basic.credit_group`,
       
    },
    dispaly: 'name'
}
}]
class BasicInfoContent extends Component {
  render() {
    const { type , t , customer} = this.props

    const list = customer?[...controls, ...groups].map(d => ({ ...d, submitting: false })):
    controls.map(d => ({ ...d, submitting: false }))
    return (
      <div className={classes.fields}>
        {/* <p className={classes.p}>{t("Basic Information")}</p> */}
        <div className={classes.form}>

          {type == 'org' ?
            Render(OrganizationControls)
            :
            Render(list)
          }
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state, props) => ({
  customer: get(state.parties__customer,'active', undefined),
  type: props.match.params.type,
  initialValues: {
    basic: {
      type: props.match.params.type,
    }
  }
})
export default withRouter(connect(mapStateToProps)(withTranslation()(BasicInfoContent)))
