import React, { Component } from 'react'

import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './style.less'
import Actions from './actions'
import map from '../../../helpers/app/actions/map';
class SetMenu extends Component {
  renderField = () => {
    return Render([{
        type: "SetMenu",
        name: 'val',
        label: '',
        className: classes.menu,
    }])
}

static onSubmit(props, values){
 props.onClick(values.val)
 props.onCancel()

}

// }
  render() {
    return (
      <>
{this.renderField()}
            <Actions/>

      </>
    )
  }
}

export default Form(SetMenu)