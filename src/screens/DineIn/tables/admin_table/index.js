import React, { Component } from 'react'
import {connect} from 'react-redux'
import {get} from 'lodash'
import $ from "jquery"
import * as tables from './types'
import {getPos} from 'helpers'

class StaticTable extends Component {
  move =()=>{
    const {setMain, table}  = this.props
    setMain('dinin__tables', {item:{...table},active:table.id})
  }
  
  displayPopup = () => {
    const {setMain, table, active, move}  = this.props
    if(move){
      this.move()
    }
    else{
      if(active == table.id){
        setMain('dinin__tables', {active:'', popup:''})
      }
      else{
        const limit = getPos(table)
        let left , top, right, bottom
        let position = $('#'+limit.width+'_'+table.pos_y).offset();
        if(position)
          left = position.left
        if(table.pos_x > 20){
          position =  $('#'+table.pos_x+'_'+table.pos_y).offset();
          left = ''
          right = window.innerWidth - position.left
        }
        top = position.top
        if(table.pos_y > 4){
          position =  $('#'+table.pos_x+'_'+limit.height).offset();
          bottom = window.innerHeight - position.top
          top=''
        }
        setMain('dinin__tables', {active:table.id, popup:{show:'show', left, top, right, bottom}})
      }
    }
  }
 

  render() {
    const { table, unit, active} = this.props
    const Component = get(tables, table.shape)
    if(Component){
      return (
          <Component {...{table , active, unit}} displayPopup={this.displayPopup}   />
      )
    }
      return <div></div>
  }
}


const mapStateToProps = (state, props) => ({
  active: state.dinin__tables.active,
  table: get(state.dinin__tables.data, props.table_id, {}),
  move: get(state.dinin__tables,'move',false)
})




export default connect(mapStateToProps)(StaticTable)

