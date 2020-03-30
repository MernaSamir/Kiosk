import React, { Component } from 'react';

export class InputComponent extends Component {
    static propTypes = {
        
    };

    onChange = (value)=>{
        const { field, form } = this.props;
        if(field.name){
            field.onChange({
                target: {
                    name: field.name,
                    value
                }
            })
        }else{
            form.setValues(value)
        }
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

export default InputComponent;
