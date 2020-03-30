import React, { Component } from 'react'
import classes from './style.less'
// import './split-check.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash';
import Paging from './paging'


class Header extends Component {
  move = ()=>{
    const { move, setAll} = this.props
    setAll([
      {type: 'set_main', app: "orders__details", data: {move:!move} },
      {type: 'set_main', app: 'orders__details', data: {active:''}},
      
  ])
     
    
  }
  render() {
    const { history, page, pageMax, handelPageClick, move } = this.props
    return (
      <div className={classes.header }>
                    <button className={classes.back} onClick={history.goBack.bind(this)}>
                        <FontAwesomeIcon icon="arrow-left" className={classes.icon}></FontAwesomeIcon>
                        <span>Back</span>
                    </button>
                    <p >Edit Split Check</p>
                    <div className={classes.buttons}>
                      <button className={move?classes.clicked:classes.move} onClick={this.move}>Move</button>
                      <Paging {...{page, pageMax, handelPageClick}}/>
                    </div>
      </div>
    )
  }
}
const mapStateToProps = (state) =>({
  move:get(state, 'orders__details.move',false)
})
export default withRouter(connect (mapStateToProps, mapDispatchToProps)(Header))
