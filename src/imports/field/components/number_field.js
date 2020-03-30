import React from 'react';
import inputComponent from 'helpers/components/input';
import valFun from 'helpers/functions/show'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import BasicComponent from 'helpers/components/basic'
export class txtInput extends inputComponent {
    updateKeyboard = (props)=>{
        const {setPath, no_keyboard} = this.props;
        if(!no_keyboard){
            const val = props.field.value;
            setPath('bottom_sheet', 'field.value', val);
        }
    }
    compare = {
        field: {
            compare: ['field.value'],
            action: this.updateKeyboard
        }
    }
    getClick() {
        const { setMain, field, form, label, no_keyboard, onClick } = this.props
        if(!no_keyboard){
            return setMain('bottom_sheet', { field: field, type: 'numpad',data:{width:'9vh'} ,label, form })
        }
        return onClick(field);
    }
    render() {
        const { placeholder, field, show = "text", field_type = "text", disabled} = this.props
        return (
            <BasicComponent {...this.props} compare={this.compare}>
                <input disabled={disabled}
                    onClick={this.getClick.bind(this)} placeholder={placeholder} type={field_type} {...field} value={valFun(show, field.value || '')} />
            </BasicComponent>
        );
    }
}

export default connect(null, mapDispatchToProps)(txtInput)
