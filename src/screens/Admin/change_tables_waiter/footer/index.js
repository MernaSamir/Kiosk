import React, { Component } from 'react'
import classes from './../style.less'

export default class Footer extends Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    const {t} = this.props
    return (
      <div className={classes.footer}>
          <div className={classes.btns}>
              <button type="button" >{t('Cancel')}</button>
              <button type="button" id={classes.save}>{t('Save')}</button>
          </div>
        
      </div>
    )
  }
}
