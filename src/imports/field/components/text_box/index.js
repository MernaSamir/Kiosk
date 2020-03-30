import React from 'react';
import inputComponent from 'helpers/components/input';
import valFun from 'helpers/functions/show'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { omit } from 'lodash'
import BasicComponent from 'helpers/components/basic'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classses from './style.less'

export class txtInput extends inputComponent {

    updateKeyboard = (props) => {
        const { setPath, no_keyboard } = this.props;
        if (!no_keyboard && !window.cordova) {
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
        const { setMain, field, form, label, no_keyboard, numPad } = this.props
        if (!no_keyboard && !window.cordova) {
            if (numPad) {
                return setMain('bottom_sheet', {
                    field, type: 'numpad', data: { width: '9vh' }, label, form
                })
            }
            setMain('bottom_sheet', { ...omit(this.props, 'onClick'), type: 'keyboard' })
        }
        return false
    }

    getValue = () => {
        const { field, show = 'text' } = this.props
        // console.log(field)
        // if (ratio) {
        //     return round(valFun(show, field.value || '') / ratio, 2)
        // }
        return valFun(show, field.value || '')
    }
    reset = (props = this.props) => {
        props.setAll([{
            type: "reset_all_bottom_sheet",
            data: {}
        }])
    }
    KeyPress = (ev)=>{
        const {no_keyboard, form} = this.props;
        if(no_keyboard && ev.key === 'Enter'){
            form.submitForm()
            this.reset()
        }
        return ev
    }
    render() {
        const { placeholder, field, field_type = "text", disabled, autoFocus, search,
            iconClass = classses.search } = this.props
        // console.log(field, "  ==  ", ratio)
        return (
            <>
                {search && <FontAwesomeIcon icon="search" className={iconClass}></FontAwesomeIcon>}
                <BasicComponent {...this.props} compare={this.compare}>
                    <input disabled={disabled} autoFocus={autoFocus} onKeyPress={this.KeyPress}
                        onClick={this.getClick.bind(this)} placeholder={placeholder} type={field_type}
                        {...field} value={this.getValue()} />
                </BasicComponent>
            </>
        );
    }
}

export default connect(null, mapDispatchToProps)(txtInput)