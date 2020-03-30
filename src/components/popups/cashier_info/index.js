import React, { Component } from 'react'
import Calculator from 'components/calculator'
import classes from './style.less'
import {withTranslation} from 'react-i18next'



class CashierPopUp extends Component {
  state = {
    numeric: ''
  }
  updateValue = (value) => {
    let numeric = value.toString()
    const num = this.state.numeric

    if (num.length == 1 && num[0] == '0') {
      this.setState({
        numeric: numeric
      })
    }
    else {
      this.setState({
        numeric: this.state.numeric + numeric
      })
    }

  }
  clearPad = () => {
    this.setState({
      numeric: '0'
    })
  }
  clearDigit = () => {
    if (this.state.numeric.length == 1) {
      this.setState({
        numeric: '0'
      })
    }
    else {
      this.setState({
        numeric: this.state.numeric.slice(0, -1)
      })
    }

  }
  render() {
    const { amount , t } = this.props
    return (
      <div className={classes.cashier_popup_container}>

        <div className={classes.title_div}>
          <p>{t("Cash Settlement - Cashier One")}</p>
        </div>
        <div className={classes.cash}>
          <p className={classes.title}>{t("Cash")}:</p>
          <input type="text" className={classes.cash_input} placeholder={`$ ${amount}`} value={this.state.numeric} />
        </div>
        <Calculator size='10vh' updateValue={this.updateValue}
          clearDigit={this.clearDigit} clearPad={this.clearPad} />

        {/* <div className={classes.DiscoustSumbitButtons}>
          <button className={classes.CancelBtn} onClick={() => this.cancelClick()}>Back</button>
          <button className={classes.OkBtn} onClick={() => this.cancelClick()}>Ok</button>
        </div> */}
        <div className={classes.last}>
          <button type="button" >{t("Cancel")}</button>
          <button type="submit">{t("Ok")}</button>
        </div>
      </div>
    )
  }
}
export default withTranslation() (CashierPopUp)
