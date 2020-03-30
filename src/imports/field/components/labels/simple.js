import React, { Component } from 'react'
import { round } from 'lodash'

class Label extends Component {

  renderValue = () => {
    const { field } = this.props
    // if (ratio) {
    //   return round(field.value / ratio, 2)
    // }
    return field.value
  }

  render() {
    const { field } = this.props
    // console.log(field)
    return (
      <label>{this.renderValue()}</label>
    )
  }
}

export default Label