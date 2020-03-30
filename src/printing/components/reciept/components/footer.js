import React, { Component } from 'react'
var QRCode = require('qrcode.react');
import classes from '../style.less'

export default class Footer extends Component {

  renderQR = (value) => {
    // let QR =QRCode()
    return <QRCode style={{height: '30%', width: '30%'}} value={value} />

  }

  render() {
    const { receipt_settings={} } = this.props
    return (
      <div className={classes.Footer}>
        {/* <p>{receipt_settings.footer}</p> */}
        <div className={classes.qr}>
          {receipt_settings.qr_code && this.renderQR(receipt_settings.qr_code)}
        </div>
        <p>{receipt_settings.footer}</p>
      </div>
    )
  }
}
