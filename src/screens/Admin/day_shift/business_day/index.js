import React, { Component } from 'react'
import classes from '../style.less'

export default class BusinessDay extends Component {
  render() {
    const { prevBD = {}, renderBtns, b_d, renderTime , t } = this.props

    return (
      <>
        <div className={classes.details}>
          <div className={classes.block}>
            <p className={classes.title}>{t("Previous Day")}</p>
            <p className={classes.result}>{prevBD.business_day}</p>
          </div>
          <div className={classes.block}>
            <p className={classes.title}>{t("Last Day Ended at")}</p>
            <p className={classes.result}>{renderTime(prevBD.end_time)}</p>
          </div>
        </div>
        {renderBtns(b_d)}
      </>
    )
  }
}
