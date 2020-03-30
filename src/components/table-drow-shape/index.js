import React, { Component } from 'react'
import './style.less'
import './style.css'

export default class TableDrowShape extends Component {
  render() {
      const {shape} = this.props
    return (
      <div className={shape} style={{position:'absolute'}}>
        
      </div>
    )
  }
}
