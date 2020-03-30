import React, { Component } from 'react'


export default class Square_itemButton extends Component {
  render() {
    
    // default props: width:12% ,padding:6.5% 3% 
    const style ={
      width: this.props.width,
      height: 'auto',
      padding: this.props.padding,
      borderRadius: '7%',
      border: 'none',
      border: '0.5px solid rgba(112, 112, 112, 0.46)',
      backgroundImage: 'linear-gradient(to bottom, #ffffff, #e6e6e6)',
      fontFamily: 'Humanist521BT-Roman',
      fontSize: this.props.fontSize? this.props.fontSize :'62.5%',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontStretch: 'normal',
      lineHeight: '1.11',
      letterSpacing: 'normal',
      textAlign: 'center',
      color: '#707070',
      margin: '0.7% 0.7%',
      cursor: 'pointer',
      display:this.props.display,
      flexDirection: this.props.flexDirection,
      justifyContent: this.props.justifyContent
  };

  const priceStyle ={
      backgroundColor:'#e3e3e3',
      width: '98%',
      alignSelf: this.props.alignSelf,
      margin: '0',
      bottom: '0'
  };

  

    return (
      <div style={style}>
            {this.props.item.name}
           {this.props.item.price>0?<div style={priceStyle}> +{this.props.item.price}</div> :undefined}
      </div>
    )
  }
}