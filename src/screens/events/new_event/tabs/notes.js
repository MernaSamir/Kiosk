import React, { Component } from 'react'
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './style.less';
import { withTranslation } from 'react-i18next';

 class Notes extends Component {
  render() {
    const {t} = this.props
    return (
      <div className={classes.noteDiv}>
      <p className={classes.p}>{t("Notes")}</p>

      {Render([{
            name: "notes",
            type: 'MultiText',
            label: 'New Note',
            field_name: 'note',
            className: classes.note,
            width:'54vw',
            onClick: this.props.selectInput,
            numPad:false

        }])}
        </div>

    )
  }
}

export default (withTranslation()( Notes))
