import React from 'react'
import { Input } from 'antd'
import inputComponent from 'helpers/components/input'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import BasicComponent from 'helpers/components/basic'
const { TextArea } = Input
class textArea extends inputComponent {
  updateKeyboard = (props) => {
    const { setPath, no_keyboard } = this.props;
    if (!no_keyboard) {
      const val = props.field.value;
      return setPath('bottom_sheet', 'field.value', val);
    }
    // return onClick
  }
  compare = {
    field: {
      compare: ['field.value'],
      action: this.updateKeyboard
    }
  }
  getClick() {
    const { setMain, field, form, label, no_keyboard } = this.props
    if (!no_keyboard) {
      setMain('bottom_sheet', { field, type: 'keyboard', label, form })
    }
    return false
  }

  render() {
    const { placeholder, field } = this.props
    return (
      <BasicComponent {...this.props} compare={this.compare}>
        <TextArea onClick={this.getClick.bind(this)} rows={4} placeholder={placeholder} {...field}></TextArea>
      </BasicComponent>


    )
  }
}
export default connect(null, mapDispatchToProps)(textArea)
