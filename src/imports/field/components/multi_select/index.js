import React, { Component } from 'react';
import {connect} from 'react-redux'
import {isEmpty, get, map, find, reject, includes, sumBy} from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import { message } from 'antd';
import  classes  from './style.less';

class multiButtons extends Component {
    componentDidMount() {
      const {list, fetchAll, app} = this.props;
      if(isEmpty(list) && app){
        fetchAll([{
            app: app.name,
            api: app.api
        }])
      }
     
    }
    onChange = (value)=>{
      const {field} = this.props;
      field.onChange({
        target: {
          name: field.name,
          value
        }
      })
    }
    onClick = (d)=>{
        const {field, max} = this.props;
        const value = isEmpty(field.value) ? []:field.value;
        const found = find(value, v=>(v.id == d.id));
        if( max  ){
            if(sumBy(value, 'quantity') < max){
                if(found){

                    let newVal = reject(value, v=>(v.id == found.id))
                    this.onChange([...newVal, {id:found.id, quantity:found.quantity + 1}])
                }
                else{
                    this.onChange([...value, {id: d.id, quantity: 1}])
                }

            }
            else{
                message.warning('you have max length')
            }
        
       
        }
        else if (max != 0){
            if(found){

                let newVal = reject(value, v=>(v.id == found.id))
                this.onChange([...newVal, {id:found.id, quantity:found.quantity + 1}])
            }
            else{
                this.onChange([...value, {id: d.id, quantity: 1}])
            }
        }
        
    }
  
    
    renderOptions = () => {
        const { list, field ,disabled=[]} = this.props
        return map(list, (d,idx) => (
            
            <button disabled={disabled.includes(d.id)?true:false  } key={idx} type="button" className={includes(map(field.value,d=>(d.id)) , d.id) ?"active":'' } onClick={this.onClick.bind(this, d)}>
            {d.name} 
            </button>
        ))
    }
    render() {
        const { className}=this.props
        return (
            <div  className={className}>
                {this.renderOptions()}
            </div>
        );
    }
}
const mapStateToProps = (state, props)=>
({list: props.options || get(state, `${get(props.app, 'name', '')}.data`, {})})
export default connect(mapStateToProps, mapDispatchToProps)(multiButtons);