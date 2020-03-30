import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './style.less'
import { withTranslation } from 'react-i18next'
class Back_Button extends Component {

  onClick = () => {
    const { onClick, history } = this.props
    if (onClick) {
      onClick()
    }
    history.goBack()
  }

  render() {

    const { onClick = this.onClick, t, authorize = true } = this.props
    return (
      <button disabled={!authorize} className={classes.btn} onClick={onClick.bind(this)} type='button'>
        <FontAwesomeIcon className={classes.icon} icon='arrow-left' />&nbsp;  &nbsp;{t("Back")}
      </button>
    )
  }
}

export default withRouter(withTranslation()(Back_Button));
