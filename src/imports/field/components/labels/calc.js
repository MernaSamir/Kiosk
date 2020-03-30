import React from 'react';
import {pick, isEqual} from 'lodash';
import InputComponent from 'helpers/components/input';
class calc extends InputComponent {
    constructor(props) {
      super(props);
      if(props.form.values){
          this.updateValues(props)
      }
    }
    updateValues = (props)=>{
        const {func, form} = props;
        this.onChange(func(form.values))
    }
    shouldComponentUpdate(nextProps, prevState) {
        const compare = ['form.values'];
        
        if(!isEqual(pick(this.props, compare), pick(nextProps, compare))){
            this.updateValues(nextProps)
        }
        return !isEqual(this.props, nextProps);
    }
    render() {
        const {func, form} = this.props
        return (
            <label>
                {func(form.values)}
            </label>
        );
    }
}

export default calc;
