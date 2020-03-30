import React from 'react';
import InputComponent from 'helpers/components/input.js'
import classes from './style.less'
import Shape from './shapes/shape'
import {map} from 'lodash'
export default class selectShape extends InputComponent {
   shapes = {
       rectangle:{
           shape:'Rectangle',
           label:'Rectangle'
       },
       Cricle:{
        shape:'Circle',
        label:'Circle'
    },
    Square:{
        shape:'Square',
        label:'Square'
    },
   }
    onClick = (d)=>{
        this.onChange(d)
    }
   
  
    
    render() {
        const {field} = this.props;
        return (
            <div className={classes.shapesContainer}>
            <p>Shape</p>
               <div>
                {map(this.shapes,(d,idx)=>(<Shape key={idx} shape={d.shape} label={d.label}
                 onClick={this.onClick} className={(field.value == d.shape) ?'active':''}></Shape>))}
               </div>
            </div>
        );
    }
}
