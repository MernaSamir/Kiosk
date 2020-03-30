import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get, pick, isEqual, filter, map, isEmpty } from 'lodash'
import LayoutFormik from './layout_formik'
import mapDispatchToProps from 'helpers/actions/main';
import applyFilter from 'helpers/functions/filters';

export class layout extends Component {
  renderlayouts = ({ handleChange, handleBlur, submitForm }, key) => {
    const { appSetting, activeItem, tabKey } = this.props
    let filterdLayout = appSetting.layouts;
    if (appSetting.tabs) {
      filterdLayout = filter(appSetting.layouts, d => d.tabkeys.find(f => f == key))
    }
    return map(filterdLayout, (d, index) => {
      let valid = true
      if (get(d, 'pers.field')) {
        const isempty = get(d, 'pers.isempty', false)
        console.log("VALIDATION", applyFilter(get(d, 'pers.field', {key: "true"})))
        valid = isempty ? !isEmpty(applyFilter(get(d, 'pers.field', {key: "true"}))) :
        Boolean(applyFilter(get(d, 'pers.field', {key: "true"}))) 
        
      }


      if(!valid){
        return <></>
      }

      return <LayoutFormik
        key={index}
        index={index}
        activeItem={activeItem}
        name={d.reduxName}
        layout={d}
        tabKey={tabKey}
        submitFullForm={submitForm}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />
    });
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return !isEqual(
      { ...pick(this.props, ['activeItem', 'appSetting', 'fullForm']) },
      { ...pick(nextProps, ['activeItem', 'appSetting', 'fullForm']) }
    )
  }
  render() {
    const { handleBlur, handleChange, tabKey, submitForm } = this.props
    return (
      this.renderlayouts({ handleBlur, handleChange, submitForm }, tabKey)
    )
  }
}

const mapStateToProps = (state) => ({
    appSetting: get(state, 'apps.active', {}),
    get activeItem() {return get(state, `${this.appSetting.reduxName}.active`)},
    fullForm: get(state, "form" , {} )
})

export default connect(mapStateToProps, mapDispatchToProps)(layout)
