import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import valFun from 'helpers/functions/show'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ButtonPopup extends Component {
    onClick=(value)=>{
        
        const {field, setMain, onbtnClick} = this.props;
       onbtnClick && onbtnClick(value)

        field.onChange({
            target: {
                name: field.name,
                value:value
            }
        })
        setMain('popup',{popup: {}})
    }
    openPopup=()=>{
        const {setMain, field , popupType, form , widthPopup='70%'} = this.props
        const popup = {type: popupType, visable:true,width: widthPopup ,
            childProps:{
                onClick: this.onClick,
                form:form,
                initialValues: {
                    val: field.value,
                }
            }
        }
        setMain('popup',{popup})
    }
  render() {
      const {field, ftype,icon,onbtn='please Select' ,...props } = this.props;
      const view =  field.value?valFun({...props, type: ftype}, field.value):onbtn

      return (
        <div>
            <button type="button" onClick={this.openPopup }>
            {icon? <FontAwesomeIcon icon={['far', 'sticky-note']} />:field.value ? view:onbtn}

            </button>
        </div>
    )
  }
}
export default connect(null, mapDispatchToProps)(ButtonPopup)