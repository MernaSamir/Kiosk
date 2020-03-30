import React, { Component } from 'react'
import styles from '../style.less'
import { withRouter } from 'react-router-dom'
import Header from 'components/header_back'
import Search from 'components/search'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Paging from 'helpers/components/paging'
import { withTranslation } from 'react-i18next';
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import applyFilters from 'helpers/functions/filters'

class CustomerHeader extends Component {

  openPopup = () => {
    const { setMain } = this.props
    const popup = {
      type: 'CustOrOrgan', visable: true, width: "70%",
    }
    setMain('popup', { popup })

  }
  static onSubmit(props, values) {
    const { setMain } = props
    setMain('main', {search:values.input})
}
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
  
  render() {
    const {t} = this.props
    const { page, handelPagination, maxlength } = this.props;
    return (
      <>
        <Header name={t("Customers")} background="#f0f7ff" />

        <div className={styles.header}>
        <div className={styles.search}>
             {/* <Search iconClass={styles.icon} /> */}
             {this.renderField()}
             </div>
          <div className={styles.right}>
            <button disabled={!applyFilters({key: 'authorize', compare: ['customer_add']})}
            className={styles.button} onClick={this.openPopup}>{t('New Customer')}</button>
            <Paging maxLength={maxlength}
              page={page}
              handelClick={handelPagination}
            />

          </div>

        </div>
      </>
    )
  }
}

export default connect(null, mapDispatchToProps)(withRouter(withTranslation()( Form(CustomerHeader))));