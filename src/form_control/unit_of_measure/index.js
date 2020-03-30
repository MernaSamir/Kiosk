import React, { Component } from 'react'
// import './style.css'
import { connect } from 'react-redux'
import { Select } from 'antd'
import Table from './table'
const Option = Select.Option
 class units_ extends Component {
  state = {
    value: 0,
  }

  onChange = (event) => {


    this.setState({ value: event.target.value })
  }

  kilograms_to_grams = (weight) => {
    const grams = parseInt(weight) * 1000;
    return grams;
  }


  render() {
    return (
      <div className="units_container">
      <div><Table/></div>
      <div className='secondcolumn'>
        <div className='input_select'>
          <input className="unit_input" name="input1" onChange={this.onChange}
          ></input>
          <Select>
          <Option value='kilo'>KiloGram</Option>
          </Select>
        </div>

        <h2 className='h_style'>  = </h2>

        <div className='input_select'>
          <input className="unit_input" name="input2" onChange={this.onChange}
            value={this.kilograms_to_grams(this.state.value || 0)} readOnly='true'></input>
               <Select>
                 <Option value='gram'>Gram</Option>
               </Select>
        </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
  
}
export const units = connect(mapStateToProps, mapDispatchToProps)(units_)
export default units