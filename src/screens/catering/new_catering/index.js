import React, { Component } from 'react'
import Form from 'helpers/wrap/form'
import MainLayout from './main_layout'
import classes from './style.less'
import { withRouter } from 'react-router'
import { map, get, set, mapValues, isArray, keys, omit } from 'lodash'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Actions from './actions';
import applyFilters from 'helpers/functions/filters';
import { withTranslation } from 'react-i18next';

let flag = false

class Catring extends Component {
  constructor(props) {
    super(props);
  }
  static onSuccess(props, values, keys, keyIndex, key, res, data) {
    keyIndex = keyIndex + 1;
    set(res, key, data);
    if (keys.length != keyIndex) {
      this.savingData(props, values, keys, keyIndex, res)
    } else {
      this.finishAction(props, values,res)
    }
    return []
  }

  static savingData(props, values, keys, keyIndex = 0, res = {}) {
    const { setMain } = props;
    const key = get(keys, keyIndex);
    let oValues = get(values, key);
    const mValues = mapValues({ 'reservation': 'parties__reservation.id' }, (d) => (get(res, d, get(values, d))));
    const onSuccess = this.onSuccess.bind(this, props, values, keys, keyIndex, key, res);

    if (oValues) {
      if (isArray(oValues)) {
        setMain(key, {
          item: {
            data: map(oValues, d =>
              ({ ...d, ...mValues }
              )
            )
            ,
            action: 'bulkEdit',
            onSuccess
          }
        })
      }
      else {
        setMain(key, {
          item: {
            ...oValues,
            ...mValues,
            action: oValues.id ? 'update' : 'add',
            onSuccess
          }
        })
      }

    } else {
      onSuccess({})
    }
  }

  static finishAction(props,values, res) {
    const {order, setMain} = props
    if(order){
      return setMain('orders__main', {
        item: {
            id: order,
            event : get(res , "parties__reservation.id",""),
            action: 'update',
            onSuccess: this.save( props, values)
        }
    })
    }
    



  }
  static save(props, values){
    const { setMain, history, match } = props;
    let msg
    const action = match.params.id ? 'update' : 'add'
    action == "add" ? msg = 'Catring Created' : msg = "Catring Edited"
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
        parties__reservation: values.basic,
        parties__event_deposit: map(values.deposit.deposite, d => d),
        parties__event_tab: values.lacarte,
        // parties__tab_details: (get(values, 'menu.setmenu', null) != null) ? sortBy(map(values.menu.setmenu, d => d), [(o) => (o.parent || '0')]) : undefined,
        parties__reservation_notes: map(values.notes, d => d),

      }
      this.savingData.call(this, props, data, keys(data));
    }
  }

  state = {
    activeTab: 0
  }

  tabs = [
    { name: "Basic Info" },
    { name: "Products" },
    { name: "Deposit" },
    { name: "Notes" },
  ]

  activeHeader = (activeTab) => {
    this.setState({
      activeTab
    })
  }

  renderTabs() {
    const { activeTab } = this.state;
    const { t } = this.props
    return map(this.tabs, (d, index) =>
      (<div className={`${classes.navHeader} ${index == activeTab && classes.active}`}
        onClick={this.activeHeader.bind(this, index)}>
        <span>{t(d.name)}</span>
      </div>))
  }

  render() {
    const { activeTab } = this.state
    const { values, selectedCustomer } = this.props

    return (
      <div className={classes.contaier}>
        <p className={classes.p}>{selectedCustomer.name}</p>

        <div className={classes.header}>
          <div className={classes.tabs}>
            {this.renderTabs()}
          </div>
          {<Actions />}
        </div>
        <MainLayout
          active={activeTab} values={values}
          pick_up={this.pick_up}
          delivery={this.delivery}
        >
        </MainLayout>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  selectedCustomer: get(state.parties__customer.data, state.parties__customer.active, {}),
  initialValues: get(state, 'form.event.values', props.initialValues) || { basic: { _type: 'cat' } },
  mode: state.settings__mode.active,
  order : state.orders__main.active


})
export const CatringAdd = withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Form(Catring))))
export class EditCatring extends Component {
  constructor(props) {
    super(props);
    const reservation = applyFilters({
      key: 'GetDataSelector',
      path: 'parties__reservation',
      show: props.match.params.id
    });
    const params = { reservation: reservation.id }
    const depositList = applyFilters({
      key: 'pickingBy',
      path: 'parties__event_deposit',
      params
    });
    // const menuList = applyFilters({
    //   key: 'pickingBy',
    //   path: 'parties__tab_details',
    //   params
    // });
    const lacarte = applyFilters({
      key: 'Filter',
      path: 'parties__event_tab',
      params
    });
    const notes = applyFilters({
      key: 'Filter',
      path: 'parties__reservation_notes',
      params
    });
    this.initialValues = {
      basic: reservation,
      notes,
      deposit: { deposite: depositList },
      // menu: { setmenu: menuList },
      lacarte

    }
  }
  render() {
    return <CatringAdd initialValues={this.initialValues} />
  }
}
export default CatringAdd;