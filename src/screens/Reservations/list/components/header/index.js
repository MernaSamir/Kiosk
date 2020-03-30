import React, { Component } from 'react'
import Search from 'components/search'
import classes from './style.less'
import TimePicker from 'components/time_selector'
import Paging from 'helpers/components/paging'
import { withTranslation } from 'react-i18next';
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import mapDispatchToProps from 'helpers/actions/main'
import {connect} from 'react-redux'
 class Header extends Component {
  renderField = () => {
    return Render([{
        type: "TextBox",
        name: 'input',
        placeholder:'Search',
        // label: t('Search'),
        search:true
        // className: classes.inputField,
    }])
}
static onSubmit(props, values) {
  const { setMain } = props
  setMain('main', {search:values.input})
}
  render() {
    const {maxlength , page , handelPagination , t} = this.props 
    return (
      <div className={classes.header}>

        <div className={classes.search}> 
        {/* <Search iconClass={classes.icon} /> */}
          {this.renderField()}
        </div>
        <TimePicker width='12%'/>
        <div className = {classes.cap_info}>
          <p>{t("Available Tables")}</p>
        </div>
        <Paging maxLength={maxlength}
              page={page}
              handelClick={handelPagination}
            />

      </div >

    )
  }
}
export default connect (null, mapDispatchToProps) ( withTranslation()(Form(Header)) )