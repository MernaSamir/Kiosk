import React, { Component } from 'react'
import Red_Square_Button from './Red_Square_Button'
export default class Calculator extends Component {
    
    renderPad = () => {
        const pad = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        const {size,updateValue} = this.props
        return pad.map(element => {
            return <Red_Square_Button name={element} width={size} margin='1% 1.5%' onClick={() =>updateValue(element)} />
        });
    }
    render() {
        const {size, clearPad,clearDigit,updateValue } = this.props
        return (
            <div className='popupCalculator' >
                {this.renderPad()}
                <Red_Square_Button name='C' width={size} margin='1% 1.5%' onClick={() => clearPad()} />
                <Red_Square_Button name={0} width={size} margin='1% 1.5%' onClick={() => updateValue(0)} />
                <Red_Square_Button name='D' width={size} margin='1% 1.5%' onClick={() => clearDigit()} />
            </div>
        )
    }
}
