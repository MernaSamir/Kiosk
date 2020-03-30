import React, { Component } from 'react'
import classes from './style.less'
import BasicInfo from './tab'
import { withRouter } from 'react-router'
import { map, get, set, keys, mapValues, isArray, filter } from 'lodash'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Form from 'helpers/wrap/form.js';
import applyFilters from 'helpers/functions/filters'
import { withTranslation } from 'react-i18next';

let flag = false

class CustomerInformation extends Component {

  componentWillMount() {
    const { setMain } = this.props;
    setMain("form_actions", { active_tab: '' })
  }

  static onSuccess(props, values, keys, keyIndex, key, res, data) {
    keyIndex = keyIndex + 1;
    set(res, key, data);
    if (keys.length != keyIndex) {
      this.savingData(props, values, keys, keyIndex, res)
    } else {
      this.finishAction(props, values)
    }
    return []
  }

  static savingData(props, values, keys, keyIndex = 0, res = {}) {
    const { setMain } = props;
    const key = get(keys, keyIndex);
    let oValues = get(values, key);
    const mValues = mapValues({ 'customer': 'parties__customer.id' }, (d) => (get(res, d, get(values, d))));
    const onSuccess = this.onSuccess.bind(this, props, values, keys, keyIndex, key, res);
    if (oValues) {

      if (isArray(oValues)) {
        setMain(key, {
          item: {
            data: map(oValues, d => ({ ...d, ...mValues })),
            action: 'bulkEdit',
            onSuccess
          }
        })
      }

      else {
        const item = { ...oValues, ...mValues }

        setMain(key, {
          item: {
            ...oValues,
            ...mValues,
            action: oValues.id ? 'update' : 'add',
            onSuccess
          }
        })
      }
    }

    else {
      onSuccess({})
    }
  }

  static finishAction(props, values) {
    const { setMain, history, match } = props;
    let msg
    const action = match.params.id ? 'update' : 'add'
    action == "add" ? msg = 'Customer Created' : msg = "Customer Edited"
    const popup = {
      type: 'Save', visable: true, width: "50%",
      childProps: {
        msg: msg,

      }
    }
    flag = false
    setMain('popup', { popup })
    history.goBack()
  }

  static onSubmit(props, values) {
    if (!flag) {
      flag = true
      const data = {
        parties__customer: values.basic,
        parties__address: [...map(values.address, d => d).filter(d => d.street)],
        parties__customer_contacts: [
          ...map(values.emails, d => d),
          ...map(values.homephones, d => d),
          ...map(values.workphones, d => d),
          ...map(values.mobilphones, d => d)
        ],
        parties__family_members: values.family
      }
      this.savingData.call(this, props, data, keys(data));
    }
  }

  cancelAdd = () => {
    const { history, setMain } = this.props
    history.goBack()
    setMain('popup', { popup: {} })
  }

  CancelCustomer = () => {
    const { setMain } = this.props
    const popup = {
      type: 'CancelCustomer', visable: true, width: "50%",
      childProps: {
        Title: 'Cancel New Customer',
        first_msg: 'Are you sure you want to Cancel?',
        second_msg: 'All unsaved data will be lost',
        pressYes: this.cancelAdd
      }
    }
    setMain('popup', { popup })
  }

  tabs = [{
    name: "Basic Information"
  },
  {
    name: "Contacts"
  },
  {
    name: "Addresses"
  },
  {
    name: "Extra Information"
  }
  ]

  state = {
    active: 0
  }

  activeHeader = (active) => {

    this.setState({
      active
    })
  }

  renderTabs() {
    const { active } = this.state;
    const { active_tab, t } = this.props;
    active_tab && this.setState({
      active: active_tab
    })
    return map(this.tabs, (d, index) =>
      (<div key={index} className={`${classes.navHeader} ${index == active && classes.active}`}
        onClick={this.activeHeader.bind(this, index)}>
        <span>{t(d.name)}</span>
      </div>))
  }

  render() {
    const { active } = this.state
    const { values, setValues, handleChange, t } = this.props
    return (
      <div className={classes.contaier}>
        <div className={classes.header}>
          <div className={classes.tabs}>
            {this.renderTabs()}
          </div>
          <div className={classes.button}>
            <button type="button" onClick={this.CancelCustomer}>{t('Cancel')}</button>
            <button type='submit'>{t("Save")}</button>
          </div>
        </div>
        <BasicInfo
          active={active} values={values} handleChange={handleChange} setValues={setValues}>
        </BasicInfo>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  initialValues: props.initialValues || {
    basic: {
      _type: props.match.params.type
    }
  },
  active_tab: state.form_actions.active_tab
})

export const CustomerAdd = withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(Form(CustomerInformation))))

export class CustomerEdit extends Component {

  constructor(props) {
    super(props);
    const basic = applyFilters({
      key: 'GetDataSelector',
      path: 'parties__customer',
      show: props.match.params.id
    });
    const params = { customer: basic.id }
    const contacts = applyFilters({
      key: 'Filter',
      path: 'parties__customer_contacts',
      params
    });
    const address = applyFilters({
      key: 'Filter',
      path: 'parties__address',
      params,
      then: {
        key: 'keys',
        levels: ['id']
      }
    });
    const addresses = address ? address : undefined
    const family = applyFilters({
      key: 'Filter',
      path: 'parties__family_members',
      params
    });

    this.initialValues = {
      basic,
      family,
      emails: filter(contacts, { _type: 'em' }),
      workphones: filter(contacts, { _type: 'wp' }),
      mobilphones: filter(contacts, { _type: 'mp' }),
      homephones: filter(contacts, { _type: 'hp' }),
      address: addresses

    }
  }

  render() {
    return <CustomerAdd initialValues={this.initialValues} />
  }
}



export default (CustomerAdd);
