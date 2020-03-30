import React, { Component } from 'react'
import classes from './style.less'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'

class seperate extends Component {
  seperate=()=>{
      const {table, setAll} = this.props
      setAll([
        {type: 'set_main_dinin__tables', data: { item: { id: table.id, combined:null,  action: 'update'} }},
        {type: 'set_main_popup', data: {popup:{}}},
      ])
  }
  render() {

    return (
      <div className={classes.container}>
          <p>Confirm Seperate Table</p>
       <button onClick={this.seperate.bind(this)}> Seperate</button>
      </div>
    )
  }
}
export default connect(null, mapDispatchToProps)(seperate)
