import React, { Component } from 'react'


export default class Red_Rectangle_Button extends Component {
  render() {
    const {disable} = this.props
    //linear-gradient(to bottom, #fafafa, #f1f1f1)
    const style = {
      width: this.props.width,
      height: this.props.height,
      padding: this.props.padding,
      borderRadius: '1vh',
      border: '1px solid #e0e0e0',
      backgroundImage: this.props.backgroundColor ? this.props.backgroundColor : 'linear-gradient(to bottom, #d73f7c, #d73f7c)',
      fontFamily: 'NunitoSans',
      fontSize: '2.3vh',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontStretch: 'normal',
      lineHeight: '1.11',
      letterSpacing: 'normal',
      textAlign: 'center',
      color: this.props.color ? this.props.color : '#ffffff',
      margin: '0.5% 0.5%',
      float: this.props.float,
      cursor: 'pointer',
      outline: 'none'
    };
    const { type = "button", className } = this.props;
    return (
      <button className={className && className} type={type} style={style} onClick={this.props.onClick} disabled={disable}>
        {this.props.name}
      </button>
    )
  }
}
