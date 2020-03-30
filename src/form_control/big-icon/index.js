import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.css'
export class BigIcon extends Component {

  render() {
      const {icon , color , size} = this.props
    return (
      <div className='icons'>
    <FontAwesomeIcon icon={icon} size={size}  color={color}   />
      </div>
    )
  }
}
export default BigIcon