import React, { Component } from 'react'
import RedSqure from 'components/Red_Square_Button'
import { get, map, isEqual, last, includes, isEmpty } from 'lodash'
import { connect } from 'react-redux'
import classes from './style.less'
// import calculator from 'components/calculator_pad'

const calculator = {
  num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  frac: [
    { name: "1 / 8", value: 0.125 },
    { name: "1 / 4", value: 0.25 },
    { name: "1 / 3", value: 0.33 },
    { name: "1 / 2", value: 0.5 },
    { name: "2 / 3", value: 0.66 },
    { name: "3 / 4", value: 0.75 }
  ]
}

class Calculator extends Component {

  state = {
    reset: true
  }

  reset() {
    const { setMain, active } = this.props
    if (active.id) {
      setTimeout(() => {
        setMain("orders__details", { item: { quantity: '', id: active.id } })
      }, 50)
    }
  }

  componentDidMount() {
    this.reset();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(get(prevProps.active, 'id'), get(this.props.active, 'id'))) {
      this.reset()
    }
  }

  check = (reset, active, item, value) => {
    let val
    if (reset && active.quantity == 1) {
      val = value
      this.setState({
        reset: false
      })
    }
    else {
      val = (item.quantity == null ? active.quantity : item.quantity) + "" + value
    }
    return val
  }

  buttonfunction = (value, frac = false) => {
    const { setMain, active, item, append_path } = this.props
    let newVal = 0
    let val
    if (!frac) {
      val = this.check(this.state.reset, active, item, value)
    }
    else {
      if (!includes(val, '.')) {
        val = parseInt((active.quantity == 1 && item.quantity == "") ? value : active.quantity) + value
      }
    }
    newVal = val.toString()
    setMain("orders__details", { item: { quantity: newVal.toString(), id: active.id } })
    if (last(newVal) != '.') {
      append_path("orders__details", 'item', {
        action: 'update'
      })
    }
  }

  plus = () => {
    const { setMain, active, append_path } = this.props
    let quantity = active.quantity.toString()
    let hasdot = quantity.indexOf('.')
    let newVal = 0
    if (hasdot == -1) {
      newVal = (parseInt(active.quantity) + 1).toString()
    }
    else {
      let fracVal = quantity.substr(hasdot + 1)
      newVal = (parseInt(active.quantity) + 1).toString() + "." + fracVal.toString()
    }
    setMain("orders__details", { item: { quantity: newVal, id: active.id } })
    append_path("orders__details", 'item', {
      action: 'update'
    })
  }

  minus = () => {
    const { setMain, active, append_path } = this.props
    let quantity = active.quantity.toString()
    if (active.quantity <= 1) {
      return
    }
    let hasdot = quantity.indexOf('.')
    let newVal = 0
    if (hasdot == -1) {
      newVal = (parseInt(active.quantity) - 1).toString()
    }
    else {
      let fracVal = quantity.substr(hasdot + 1)
      newVal = (parseInt(active.quantity) - 1).toString() + "." + fracVal.toString()
    }
    setMain("orders__details", { item: { quantity: newVal, id: active.id } })
    append_path("orders__details", 'item', {
      action: 'update'
    })
  }

  deleteDegit = () => {
    const { setMain, active, append_path } = this.props
    let len = active.quantity.toString().length
    let newVal = active.quantity > 1 && (active.quantity.toString()).slice(0, len - 1);
    this.setState({
      reset: true
    })
    setMain("orders__details", { item: { quantity: isEmpty(newVal) ? 1 : newVal, id: active.id } })
    append_path("orders__details", 'item', {
      action: 'update'
    })
  }

  renderNum = () => {
    return map(calculator.num, (i, index) => {
      return <RedSqure key={index} fontSize="2vh" width="7vh" name={i}
        onClick={() => this.buttonfunction(i)} />
    })
  }

  renderFrac = () => {
    return map(calculator.frac, (i, index) => {
      return <RedSqure key={index} fontSize="2vh" width="7vh" name={i.name}
        onClick={() => this.buttonfunction(i.value, true)} />
    })
  }

  dot = () => {
    const { setMain, active } = this.props
    let quantity = active.quantity.toString()
    let hasdot = quantity.indexOf('.')
    let newVal = 0
    if (hasdot != -1) {
      return
    }
    else if (hasdot == -1) {
      newVal = quantity + "."
      newVal = newVal.toString()
    }
    setMain("orders__details", { item: { quantity: newVal.toString(), id: active.id } })
  }

  render() {
    const { unit } = this.props
    return (
      <div className={classes.calculator_container}>
        <div style={{ height: "45%", display: 'flex', justifyContent: 'flex-start' }} >
          {this.renderNum()}
        </div>
        <div style={{ height: "45%", display: 'flex', justifyContent: 'flex-start' }} >
          <RedSqure width="7vh" name="." onClick={this.dot} />
          {unit.sales_enable_fraction && this.renderFrac()}
          <RedSqure width="7vh" name="+" onClick={this.plus} />
          <RedSqure width="7vh" name="-" onClick={this.minus} />
          <RedSqure width="7vh" name="D" onClick={this.deleteDegit} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  active: get(state.orders__details, `data.${get(state.orders__details, 'active')}`, {}),
  item: state.orders__details.item,
  get price() { return get(state.items__prices.data, this.active.item, {}) },
  get unit() { return get(state.dropdowns__units_of_measure.data, this.price.sales_unit, {}) },
})

export default connect(mapStateToProps)(Calculator)