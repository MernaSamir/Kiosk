import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { withRouter } from 'react-router-dom'
import classes from './style.less'
import Header from './header';
import Table from './table';
import { get } from 'lodash';

class Info extends Component {

  renderAssignDiv = () => {
    return <div className={classes.assign}>
      <p>Tap Order to Assign</p>
    </div>
  }

  renderBtns = () => {
    return <div className={classes.btns}>
      <button type="button" onClick={this.Start.bind()}>Cancel</button>
      <button type="button" id={classes.start} onClick={this.Start.bind()}>Satrt</button>
    </div>
  }

  Start = () => {
    const { history } = this.props
    history.goBack()
  }

  render() {
    return (
      <div className={classes.container}>
        <Header />
        <Table />
        {this.renderAssignDiv()}
        {this.renderBtns()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: get(state.auths__user, `data.${get(state.auths__user, 'activeDel', '')}`, {}),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Info))