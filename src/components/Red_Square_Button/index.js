import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './style.less';
export default class Red_Square_Button extends Component {
  render() {

    // Map over a array
    // pad: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    //let padLoop = this.state.pad.map(element => 
    //      <Red_Square_Button name={element} width='7vw' onClick={() => this.updateValue(element)} />);
    const style = {
            width: this.props.width,
            height: this.props.width,
            // margin: this.props.margin?this.props.margin: '0.7% 1%',
            borderRadius: this.props.borderRadius?this.props.borderRadius:'10%',
            fontSize: this.props.fontSize?this.props.fontSize:'2rem',
    }
    const {type="button"} = this.props
    return (
      <button className={classes.button} style={style} type={type} onClick={this.props.onClick}>
        <p className={classes.content}>
          {
            this.props.name == 'D' ?<FontAwesomeIcon icon='backspace' size='1x' color='#d73f7c' />
            :this.props.name=='I'?<FontAwesomeIcon icon='caret-right' size='1x' color='#d73f7c' />
            : this.props.name }

        </p>
      </button>
    )
  }
}
