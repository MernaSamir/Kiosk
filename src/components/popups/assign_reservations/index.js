import React, { Component } from 'react'
import { map, omit } from 'lodash'
import classes from './style.less'
import Form from 'helpers/wrap/form'
import Render from 'helpers/functions/field_mapper/renderfields'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import moment from 'moment';
import applyFilters from 'helpers/functions/filters'
import { withTranslation } from 'react-i18next';

class assignReservation extends Component {
 

  static onSubmit(props, values) {
    props.onClick(values.val)

  }

  buttonField() {

    const { tables, form } = this.props
    let final_tables
    const begin = moment(form.values.from_hour)
    const end = moment(begin).add(form.values.duration, 'hours')
    const date = moment(form.values.date)
    const filteredList = applyFilters({
      key: 'sameDate',
      path: 'parties__reservation',
      date,
      format: 'YYYY-MM-DD',
      select: 'date',
      then: {
        key: 'oring',
        funs: [{
          key: 'dateBetween',
          from: 'from_hour',
          to: 'to',
          date: begin,
          format: 'HH:mm'
        }, {
          key: 'dateBetween',
          from: 'from_hour',
          to: 'to',
          date: end,
          format: 'HH:mm'
        }]
      }
    })
    const tablesIds = map(filteredList, d => (d.table))
    final_tables = omit(tables, tablesIds)
    
    return Render([{
      name: "val",
      type: 'selectButtons',
      className: classes.btnsContanier,
      options: final_tables

    }])
  }

  render() {
const {t} = this.props
    return (
      <>
        <div className={classes.moveSeatContiner}>
          <p className={classes.title}>{t("Assign Reservation")}</p>
          <p className={classes.seatTitle}>{t("To Table")}: </p>
          {this.buttonField()}
        </div>
        <div className={classes.saveBtns}>
          <button type='button' onClick={this.props.onCancel}>{t("Cancel")}</button>
          <button type='submit'>{t("Ok")}</button>
        </div>
      </>
    )
  }
}
const mapStateToProps = (state) => ({
  tables: state.dinin__tables.data
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Form(assignReservation)))
