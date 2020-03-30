import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Search from 'components/search'
// import mapDispatchToProps from 'helpers/actions/main'
import classes from './style.less'
import Paging from 'helpers/components/paging'
import { withRouter } from 'react-router-dom'
import applyFilters from 'helpers/functions/filters';
import { map } from "lodash"
import { withTranslation } from 'react-i18next';

class Header extends Component {

  renderTabs() {
    const { activeHeader, activeTab, mode } = this.props;

    const tabs = applyFilters({
      key: 'Filter',
      path: "settings__sub_mode",
      params: {
        mode: mode.id,
      }
    })

    return <div className={classes.navHeader}>
      {map(tabs, (d, index) =>
        (<button type='button' className={`${classes.navHeaderBtn} ${index == activeTab && classes.active}`}
          onClick={activeHeader.bind(this, index, d)}>
        {d.name}
        </button>))}
    </div>
  }
  goTo = () => {
    const { history } = this.props;
    history.push('/dispatcher')

  }
  newReservation = () => {
    const { history } = this.props;
    history.push('/new_cat')


  }
  renderSecond = () => {
    const { maxlength, page, handelPagination, t } = this.props

    return (
      <div className={classes.header}>
        <div className={classes.search}> <Search iconClass={classes.icon} /></div>
        {/* <button type="button" className={classes.btn} onClick={this.goTo.bind(this)}>
          <>
            <FontAwesomeIcon icon={['fas', 'truck-moving']} style={{ fontSize: '1.5rem' }} />
            <p>{t("Dispatcher")}</p>
          </>
        </button> */}
        <button type="button" className={classes.btn} onClick={this.newReservation.bind(this)}>{t("New Catring")}</button>
        <Paging maxLength={maxlength}
          page={page}
          handelClick={handelPagination}
        />
      </div >)
  }

  render() {
    const { t } = this.props
    return (
      <>
        <div className={classes.first}>

          {this.renderTabs()}
          <p className={classes.p}>{t("Catring List")}</p>
        </div>
        {this.renderSecond()}
      </>

    )
  }
}

export default withRouter(withTranslation()(Header))
