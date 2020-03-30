import React, { Component } from 'react';
import { connect } from 'react-redux'
import { isEmpty, get, map, find, reject, includes, sumBy, round } from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import { message } from 'antd';
import classes from './style.less';

class SelectQuantity extends Component {
  componentDidMount() {
    const { list, fetchAll, app } = this.props;
    if (isEmpty(list) && app) {
      fetchAll([{
        app: app.name,
        api: app.api
      }])
    }

  }
  onChange = (value) => {
    const { field } = this.props;
    field.onChange({
      target: {
        name: field.name,
        value
      }
    })
  }
  increase = (d) => {
    const { field, max } = this.props;
    const found = find(field.value, v => v.id == d.id)
    if (!found) {

      this.onClick(d)
    }
    else {
      let newVal = reject(field.value, v => (v.id == d.id))
      if (max) {
        if (sumBy(field.value, 'quantity') < max) {
          field.onChange({
            target: {
              name: field.name,
              value: [...newVal, { ...found, quantity: found.quantity + 1 }]
            }
          })
        }
        else {
          message.warning('you have max length')
        }
      }

    }


  }
  decrease = (d) => {
    const { field } = this.props;
    if (d.quantity > 1) {
      let newVal = reject(field.value, v => (v.id == d.id))
      field.onChange({
        target: {
          name: field.name,
          value: [...newVal, { ...d, quantity: d.quantity - 1 }]
        }
      })
    }
    else if (d.quantity == 1) {
      let newVal = reject(field.value, v => (v.id == d.id))
      field.onChange({
        target: {
          name: field.name,
          value: newVal
        }
      })
    }
  }
  onClick = (d) => {
    const { field, max } = this.props;
    const value = isEmpty(field.value) ? [] : field.value;
    if (max) {
      if (sumBy(value, 'quantity') < max) {
        this.onChange([...value, { ...d, quantity: 1 }])
      }
      else {
        message.warning('you have max length')
      }
    }
    else if (max != 0) {
      this.onChange([...value, { ...d, quantity: 1, }])
    }

  }


  renderOptions = () => {
    const { list, field, disabled = [] } = this.props
    return map(list, (d, idx) => {
      const found = find(field.value, v => v.id == d.id)
      return <div disabled={disabled.includes(d.id) ? true : false} key={idx} 
        className={includes(map(field.value, d => (d.id)), d.id) ? `${classes.button} alter` : classes.button}
      >
        {d.name}
        <div className={classes.quantity}>

          <button type="button" disabled={found ? false : true} onClick={this.decrease.bind(this, found)}>-</button>
          {found ? found.quantity : 0}
          <button type="button" onClick={this.increase.bind(this, d)}>+</button>
        </div>
          <div className={classes.price}>
            <p>${round(d.price_variance,2)}</p>
          </div>
      </div>
    })
  }
  render() {
    const { className = classes.btnContainer } = this.props
    return (
      <div className={className}>
        {this.renderOptions()}
      </div>
    );
  }
}
const mapStateToProps = (state, props) =>
  ({ list: props.options || get(state, `${get(props.app, 'name', '')}.data`, {}) })
export default connect(mapStateToProps, mapDispatchToProps)(SelectQuantity);