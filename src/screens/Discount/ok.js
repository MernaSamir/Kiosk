import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import classes from './style.less'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
class Discount extends Component {
  cancel=()=>{
    const {setMain, history} = this.props
    setMain('discount__main',{active:''})
    history.goBack()
  }
  render() {
    return (
      <div className={classes.saveBtns}>
        <button className={classes.done} onClick={this.cancel}>Done</button>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(withRouter(Discount));

