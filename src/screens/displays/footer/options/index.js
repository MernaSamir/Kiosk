import React, { Component } from 'react'
import classes from './../style.less'
import IconBtn from './../../clicked_icon'

export default class PackingFooterOptions extends Component {
  render() {
    const { handelPageClick, page, pageMax } = this.props

    return (
      <div className={classes.options_container} >
        <IconBtn name="caret-up" size="3x" className={classes.footerText}
          onClick={handelPageClick.bind(this, -1)} />
        <div className={classes.footerText}> Page : {page}/{pageMax} </div>
        <IconBtn name="caret-down" size="3x" className={classes.footerText}
          onClick={handelPageClick.bind(this, 1)} />
      </div>
    )
  }
}
