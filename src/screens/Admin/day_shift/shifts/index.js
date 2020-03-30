import React, { Component } from 'react'
import classes from '../style.less'
export default class Shift extends Component {

  renderShiftOpen() {
    const { activeShifts, prevShift = {}, renderTime , t} = this.props

    if (activeShifts) {
      return <>
        <div className={classes.block}>
          <p className={classes.title}>{t("Current Shift")}</p>
          <p className={classes.result}>{activeShifts.shift_num}</p>
        </div>
        <div className={classes.block}>
          <p className={classes.title}>{t("Shift Started")}</p>
          <p className={classes.result}>{renderTime(activeShifts.start_time)}</p>
        </div>
      </>
    }

    else if (!activeShifts && prevShift.id) {
      return <>
        <div className={classes.block}>
          <p className={classes.title}>{t("Previous Shift")}</p>
          <p className={classes.result}>{prevShift.shift_num}</p>
        </div>
        <div className={classes.block}>
          <p className={classes.title}>{t("Last Shift Ended")}</p>
          <p className={classes.result}>{renderTime(prevShift.end_time)}</p>
        </div>
      </>
    }
    return <></>
  }

  renderDayOpen = () => {
    const { b_d, renderTime , t } = this.props
    return <div className={classes.details}>
      <div className={classes.block}>
        <p className={classes.title}>{t("Current Day")}</p>
        <p className={classes.result}>{b_d.business_day}</p>
      </div>
      <div className={classes.block}>
        <p className={classes.title}>{t("Day Started")}</p>
        <p className={classes.result}>{renderTime(b_d.start_time)}</p>
      </div>
      {this.renderShiftOpen()}
    </div>
  }

  render() {
    const { b_d, renderBtns } = this.props
    return (
      <>
        {this.renderDayOpen()}
        {renderBtns(b_d)}
      </>
    )
  }
}