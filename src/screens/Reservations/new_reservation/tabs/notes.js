import React, { Component } from 'react'
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './style.less';
import { withTranslation } from 'react-i18next';
import applyFilters from 'helpers/functions/filters'
import {head, get} from 'lodash'

 class Notes extends Component {
  render() {
    const {t} = this.props
    const policy = head(applyFilters({
      key: 'List',
      path:'financials__reserv_table',
      params:{
        location:'licensing__location.active'
      }
    }) )
    return (
      <div className={classes.noteDiv}>
      <div className= {classes.left}>
        <p>{t("Deposit Policy")}</p>
        <p>{get(policy, 'amount', '')}</p>
        {Render([{
            name: "Deposit Amount",
            type: 'NumberField',
            label: 'Deposit Amount',
            className: classes.deposite,
            onClick: this.props.selectInput,
            validates: { number: true}
        }])}
        </div>
      {Render([{
            name: "notes",
            type: 'MultiText',
            label: 'Notes',
            field_name: 'note',
            className: classes.note,
            onClick: this.props.selectInput,
            numPad:false,
            text_validates:{string: true}
        }])}

        
      </div>
    )
  }
}
export default withTranslation()( Notes)
