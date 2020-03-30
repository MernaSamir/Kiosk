import React, { Component } from 'react'
import Bag from '../../assets/images/001-shopping-bag@2x.png'
import classes from './style.less'
export default class gray_Rectangle_Button extends Component {
  render() {
    const { onClick, value, name, active, type = "button" } = this.props
    const style = {
      width: this.props.width,
      height: this.props.height,
      backgroundImage: this.props.backgroundImage,
      color: this.props.color,
      marginLeft: this.props.marginLeft,
      marginRight: this.props.marginRight ? this.props.marginRight : 0,

    };

    return (
      <button type={type} className={"btn" + (active ? ` ${classes.btnActive}` : '')} style={style} onClick={onClick}>
        {this.props.image ? <img className="imgst" src={require(`../../assets/images/${this.props.image.toLowerCase()}.png`)} /> : undefined}
        {name}
      </button>
    )
  }
}