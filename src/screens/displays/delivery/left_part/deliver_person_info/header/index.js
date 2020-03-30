import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash';
import classes from './style.less'

class Header extends Component {
  render() {
    const { user } = this.props
    return (
      <div className={classes.header}>
        <p>{user.name}</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: get(state.auths__user, `data.${get(state.auths__user, 'activeDel', '')}`, {}),
})

export default connect(mapStateToProps)(Header)