import React, { Component } from 'react'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withRouter } from 'react-router-dom'
import { omitBy } from 'lodash';

class MenuButton extends Component {

    selectItem=(orderItem, onChange)=>{
        const{field } = this.props
        onChange({data: omitBy(field.value, d=>(d.id==orderItem.id || d.parent==orderItem.id)), all: true})
          
    }


  render() {
    const { orderItem, onChange} = this.props;
    return (

      <td className={` ${classes.popup}`} style={{width: '23%'}}
                onClick={this.selectItem.bind(this,orderItem, onChange) }
                id={"pop" + orderItem.id}>
                    <FontAwesomeIcon icon={['far', 'trash-alt']} className={classes.tableIcon} />
            </td>
    )
  }
}

export default withRouter( MenuButton)
