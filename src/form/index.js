import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from './layouts'
import Tabs from './tabs'
import Header from './header'
import { Formik } from "formik";
import { withRouter } from 'react-router'
import { get, map, keys, omit, set, difference, find, mapValues, reduce, uniq, isEmpty } from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import style from './form-style.less'
import { message } from 'antd';
import applyFilter from 'helpers/functions/filters';
import TableList from './../containers/form/BackOffice/Table-list'

const success = () => {
  message.success('Saved Successfully', 5);
};
class FormComponent extends Component {
  state = { submitting: false };
  res = {}
  onSuccess = (values, keys, keyIndex, key, data) => {
    keyIndex = keyIndex + 1;
    set(this.res, key, data);
    if (keys.length != keyIndex) {
      this.savingData(values, keys, keyIndex)
    } else {
      this.finishDataSubmit()
    }
    return []
  }
  savingData = (values, keys, keyIndex) => {
    const { CreateApp, UpdateApp, UpdateBulkApp, layouts } = this.props;
    const key = get(keys, keyIndex);
    let oValues = get(values, key);
    const layout = find(layouts, { reduxName: key });
    const mValues = mapValues(layout.link, (d) => (get(this.res, d, get(values, d))));
    const onSuccess = this.onSuccess.bind(this, values, keys, keyIndex, key);
    //const layout = find(layouts, {reduxName: key})
    const extra_data = layout.extra_data ? applyFilter(layout.extra_data, values) : {}
    if (oValues) {
      if (oValues.id) {
        UpdateApp({ ...layout.fixed_data, ...extra_data, is_draft: this.is_draft, ...oValues, ...mValues }, onSuccess, undefined, key)
      } else {
        if (oValues.length || layout.list) {
          UpdateBulkApp(map(omit(oValues, layout.omit || []), d => ({ ...layout.fixed_data, ...extra_data, is_draft: this.is_draft, ...d, ...mValues })), onSuccess, undefined, key);
        } else {
          CreateApp({ ...layout.fixed_data, ...extra_data, is_draft: this.is_draft, ...oValues, ...mValues }, onSuccess, undefined, key);
        }
      }
    } else {
      onSuccess({})
    }

  }
  finishAction = (values, props) => {
    const { form_actions, setMain, layouts, appSettings, history } = this.props;
    if (appSettings.tableList) {
      map(form_actions, d => {
        d.resetForm({})
      })
      props.resetForm({ extra: values.extra });
      layouts.map(d => {
        if (d.reduxName) {
          setMain(d.reduxName, { active: '' })
        }
      })
    }
    success()
    if (appSettings.back) {
      history.goBack()
    }

  }
  submitData = (values, props) => {
    const { form_actions, layouts } = this.props
    this.finishDataSubmit = this.finishAction.bind(this, values, props);
    if (!this.state.submitting) {
      Promise.all(map(form_actions, (d, i) => {
        // debugger
        return d.validateForm()
          .then(v => {
            if (isEmpty(v)) {
              return d.submitForm()
            }
            throw v
          })
      })).then(d => {
        console.log(d)
        this.setState({ submitting: true }, () => {
          // setTimeout(() => {
          props.submitForm()
          // }, 50)
        })
      })
    } else {
      const extra = values.extra;
      values = reduce(values, (o, d = {}, k) => {
        const values = d.values ? { [d.name]: { ...get(o, d.name, {}), ...d.values } } : o
        return { ...o, ...values };
      }, {})
      const oKeys = keys(values);
      const lKeys = uniq(layouts.filter(d => (!d.optional)).map(d => d.reduxName))
      const diff = difference(lKeys, oKeys);
      console.log(lKeys, diff, oKeys)
      if (diff.length) {
        props.setValues({ extra: values.extra })
      } else {
        this.savingData({ extra, ...values }, uniq(layouts.map(d => d.reduxName)), 0);
      }
      this.setState({ submitting: false })
    }

  }

  handelCancel = () => {
    const { setMain, appSettings, history, match } = this.props
    setMain(`${appSettings.reduxName}`, { active: '' })
    history.push(['/app', match.params.appUrl].join('/'))
  }

  setDraft = (draft) => {
    this.is_draft = draft
  }

  renderTableList = (apis) => {
    const { tableList } = this.props;
    if (!isEmpty(tableList)) {
        return <TableList {...this.props} />
    }
}

  render() {
    const { appSettings, tableList, listCollapsed } = this.props
    const backOfficeSubbody = {
      display: isEmpty(tableList) ? 'block' : 'grid',
      gridTemplateColumns: listCollapsed ? '5% 95%' : '17% 83%',
    }
    //console.log('Form',this.props)
    return (
      <Formik onSubmit={this.submitData}>
        {({ handleSubmit, handleChange, handleBlur, values, errors, resetForm }) => (
          <div style={{ padding: '0 0.5%' }}>

            <Header handleSubmit={handleSubmit} setDraft={this.setDraft} handelCancel={this.handelCancel} resetForm={resetForm} />

            <div style={backOfficeSubbody} className={style.backOffice_Subbody}>
              {this.renderTableList()}
              {
                appSettings.tabs ?
                  <Tabs handleBlur={handleBlur} handleChange={handleChange} values={values} />
                  :
                  <div className={style.form}>
                    <Layout submitForm={handleSubmit} handleBlur={handleBlur} handleChange={handleChange} />
                  </div>
              }
            </div>

          </div>

        )}
      </Formik>
    )
  }

}

const mapStateToProps = (state, props) => ({
  appSettings: get(state, 'apps.active', {}),
  get activeItem() { return get(state, `${(this.appSettings.reduxName || "").replace(' ', '_')}`, {}) },
  form_actions: get(state, 'form_actions', {}),
  // get layouts() { return toArray(this.appSettings.layouts) },
  tableList: get(state, 'apps.active.tableList', {}),
  listCollapsed: get(state.application_settings, 'listCollapsed', '')
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(FormComponent));
