import React, { Component } from 'react'
import classes from './style.less'
import Header from './header'
import Body from './body'
import {withTranslation} from 'react-i18next'
class PanelControl extends Component {

  state = {
    page: 1,
    maxPage: 1,
    op: 0
  }

  getMaxPage = (value) => {
    this.setState({
      maxPage: value
    })
  }

  handelPageClick = (op) => {
    const { page, maxPage } = this.state
    if (!(page <= 1 && op == -1) && !(page >= maxPage && op == 1)) {
      this.setState({ page: page + op })
    }
  }

  render() {
    const {t} = this.props
    return (
      <div className={classes.control_container}>
        <div className={classes.inner}>
          <Header page={this.state.page} maxPage={this.state.maxPage}
            handelPageClick={this.handelPageClick} t={t} />
          {/* <SubHeader /> */}
          <Body page={this.state.page} getMaxPage={this.getMaxPage} t={t}/>
        </div>
      </div>
    )
  }
}

export default withTranslation()(PanelControl)