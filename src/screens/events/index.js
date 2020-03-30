import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import List from './list'
import Header from './header'

export default class Events extends Component {
  state = {
  }
  afterFetch = (list) => {
    this.setState({
      page: 1,
      maxlength: Math.ceil(list.length / 10)

    })
  }
  handelPagination = (delta) => {
    const { page } = this.state
    this.setState({ page: page + delta })
  }
  render() {
    const { match } = this.props;
    const { page, maxlength } = this.state

    return (
      <div style={{ backgroundColor: "#ffffff", height: "92%" }}>
        <Header page={page} handelPagination={this.handelPagination} maxlength={maxlength} />
        <Route exact path={`${match.url}`} render={() => <List page={page} afterFetch={this.afterFetch} />} />
        <Route path={`${match.url}/calendar`} component={List} />
      </div>
    )
  }
}
