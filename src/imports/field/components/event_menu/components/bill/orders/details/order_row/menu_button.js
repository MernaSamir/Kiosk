import React, { Component } from 'react'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { omitBy} from 'lodash';

class MenuButton extends Component {
    // constructor(props){
    //     super(props);
    //     this.activeItemClick = this.activeItem.bind(this, props.orderItem.id)
    // }
    selectItem=(orderItem, handleChange)=>{
        const{field } = this.props
        // console.log('omit', omit(field.value, orderItem.id))
      handleChange({data: omitBy(field.value, d=>(d.id==orderItem.id || d.parent==orderItem.id)), all: true})
    }
  render() {
    const { orderItem, handleChange} = this.props;
    return (

      <td className={` ${classes.popup}`}
                onClick={this.selectItem.bind(this,orderItem, handleChange) }
                // {this.activeItemClick}
                id={"pop" + orderItem.id}>
                {/* {activeCourse ? <img src={active == orderItem.id || course.id == activeCourse ? whiteImg : courseimg} /> : */}
                    <FontAwesomeIcon icon="times" className={classes.tableIcon} />
                    {/* } */}

            </td>
    )
  }
}

export default MenuButton
