import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { withRouter } from 'react-router'
import style from './style.less'
import Header from './header'
import Search from './search'
import List from './list'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get } from 'lodash'

class TableList extends Component {

  handleBodyClick = () => {
    const { listCollapsed, setMain } = this.props
    if (listCollapsed) {
      setMain('application_settings', { listCollapsed: !listCollapsed })
    }
  }

  renderbtn = () => {
    const { msg } = this.props
    return msg && <button type='button' className={this.renderClassName()} onClick={this.onClick.bind()}>
      <FontAwesomeIcon icon="plus" />
      Create Announcement
      </button>
  }

  onClick = () => {
    const { history, setMain, active } = this.props
    history.push('/app/drafts')
    setMain(`${active.reduxName}`, {active: ''})
  }

  renderClassName = () => {
    const { history } = this.props
    return history.location.pathname.includes('/drafts') && style.active
  }

  render() {
    const { listCollapsed } = this.props
    return (
      <div className={style.table_list} onClick={this.handleBodyClick}>
        <Header />

        {!listCollapsed &&
          <>
            <div className={style.btn_div}>
              {this.renderbtn()}
            </div>
            <div>
              <Search />
              <List />
            </div>
          </>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  listCollapsed: get(state.application_settings, 'listCollapsed', ''),
  active: get(state, 'apps.active', {}),
  msg: get(state.apps.active, 'msg', false),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TableList))