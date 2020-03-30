import React, { Component } from 'react'
// import Header from './Header'

import Admin from 'screens/Admin';

export default class AdminAppContainer extends Component {
  render() {
    const { match } = this.props
    return (
      <Admin match={match} />
    )
  }
}
