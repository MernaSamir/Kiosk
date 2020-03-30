import React, { Component } from 'react';
import {omit} from 'lodash';

export default function LayoutMain(WrappedComponent){
    class FieldComponent extends Component{
        handleChange = (ev)=>{
            const {field} = this.props;
            const value = this.getValue(field.value, ev.target.value);
            field.onChange({
                target: {
                    name: field.name,
                    value
                }
            })
        }
        getValue(list, val){
            if(list.includes(val)){
                return list.filter(d=>(d!=val))
            }
            return [...list, val];
        }
        render() {
            const {field, ...props} = this.props;
            return <WrappedComponent {...props} field={{...omit(field, ['onChange']), onChange: this.handleChange}} />
        }

    }
    return FieldComponent;   
}
