import React, { Component } from 'react';
import {get} from 'lodash';
class input extends Component {
    onChange = (value, name=this.props.field.name)=>{
        const {field, form} = this.props;
        if(name){
            field.onChange({target: {name, value}});
        }else{
            form.setValues(value)
        }
    }

    constructor(props) {
        super(props);
    }
    getClick(){
        return get(this.props, 'onClick', () => { }).bind(this, {...this.props, name: this.props.field.name}, null)
    }
    render() {
        return (
            <div>
                
            </div>
        );
    }
}

export default input;
