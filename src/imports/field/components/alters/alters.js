import React, { Component } from 'react';
import {isEmpty, filter, map, find, reject, includes, get} from 'lodash'
import classes from './style.less'
class Alters extends Component {
   
    onChange = (value)=>{
      const {field} = this.props;
      field.onChange({
        target: {
          name: field.name,
          value
        }
      })
    }
    onClick = (d, main)=>{
        const {field,} = this.props;
        const value = isEmpty(field.value) ? []:field.value;
        const found = find(value, v=>(v.main == main));
         
                if(found){
                    let newVal = reject(value, v=>(v.main == found.main))
                    this.onChange([...newVal, {main:found.main, alter:d.id, id:found.id}])
                }
        
    }
  
    
    renderOptions = () => {
        const { alters, field, alterKey, main} = this.props
        
        return map(filter(alters,d=>get(d, alterKey, '') == main.id), (d,idx) => (
                <button  key={idx} type="button" className={includes(map(field.value,d=>(d.alter)) , d.id) ?"active":'' }
                 onClick={this.onClick.bind(this, d, main.id)}>
                {d.name} 
                </button>
           
        ))
    }
    setMain = (main)=>{
        const{ field} = this.props
        const found = find(field.value, v=>(v.main == main.id));
        let newVal = reject(field.value, v=>(v.main == found.main))
       
        this.onChange(newVal)
    }
    renderMain=()=>{
        const { showMain, main }=this.props
        if(showMain){
        return<button onClick={this.setMain.bind(this, main)}>{main.name}</button>
        }

    }
    render() {
        return (
            <div className={classes.alter}>
                {this.renderMain()}
                {this.renderOptions()}
            </div>
        );
    }
}


export default Alters;