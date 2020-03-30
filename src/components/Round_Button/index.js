import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Round_Button extends Component {
  render() {

    // default props: width:8vw , float:left
    const style = {
            width: this.props.width,
            height: this.props.width,
            borderRadius: '50%',
            backgroundImage: 'linear-gradient(to bottom, #fcfcfc, #f0f0f0)',
            margin: '2% 5%',
            marginRight: this.props.marginRight,
            src: 'url(.././Fonts/Lato-Bold.ttf)',
            fontFamily: 'Lato-Regular',
            fontSize: '68.8%',
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontStretch: 'normal',
            lineHeight: '1.19',
            letterSpacing: 'normal',
            textAlign: 'center',
            color: '#ed2d30',
            float: this.props.float,
            border: '1px solid #e0e0e0'
    }
    const {type="button"} = this.props;
    return (
      <button type={type} style={style} onClick={this.props.onClick}>
            <FontAwesomeIcon icon={this.props.FA_icon} size={this.props.FA_size} color={this.props.FA_colo} />  
            {this.props.name}
      </button>
    )
  }
}
