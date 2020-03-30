import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash';
import Search from 'components/search'
import classes from './style.less'
import Paging from 'helpers/components/paging'
import { withRouter } from 'react-router-dom'
import applyFilters from 'helpers/functions/filters';
import { map } from "lodash"
import { withTranslation } from 'react-i18next';

class Header extends Component {

  activeHeader = (id, key) => {
    const { history, setMain } = this.props
    setMain("settings__sub_mode", { active: id })
    if (key == 'delivery') {
      history.push('/call_center_list/delivery')
    }

    else
      history.push('/call_center_list/pickup')
  }

  renderTabs() {
    const { activeTab, mode ,t} = this.props;
    const tabs = applyFilters({
      key: 'Filter',
      path: "settings__sub_mode",
      params: {
        mode: mode.id,
      }
    })
    return map(tabs, (d) => (
      <div className={`${classes.navHeader} ${d.id == activeTab.id && classes.active}`}
        onClick={this.activeHeader.bind(this, d.id, d.key)}>
        <span>{t(d.name)}</span>
      </div>
    ))
  }
  renderSecond = () => {
    const { maxlength, page, handelPagination } = this.props

    return (
      <div className={classes.header}>
        <div className={classes.search}> <Search iconClass={classes.icon} /></div>
        <Paging maxLength={maxlength}
          page={page}
          handelClick={handelPagination}
        />
      </div >)
  }

  render() {
    const {t} = this.props
    return (
      <>
        <div className={classes.first}>
          {this.renderTabs()}
          <p className={classes.p}>{t("Order Status")}</p>
        </div>
        {this.renderSecond()}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  activeTab: get(state.settings__sub_mode.data, state.settings__sub_mode.active, {}),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter (withTranslation()(Header)))