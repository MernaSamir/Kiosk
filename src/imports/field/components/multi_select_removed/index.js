import React, { Component } from 'react';
import {connect} from 'react-redux'
import {isEmpty, get, map, find, reject, filter} from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import { message } from 'antd';

class multiButtonsRemoved extends Component {
    componentDidMount() {
      const {list, fetchAll, app} = this.props;
      if(isEmpty(list) && app){
        fetchAll([{
            app: app.name,
            api: app.api
        }])
      }
      // if(activeList.length){
      //   this.onChange(activeList)
      // }

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
        const found = find(value, v=>(v.stock_item == d.id));
        if(found){
          
          this.onChange([...reject(value, v=>(v.stock_item==found.stock_item)),{stock_item:found.stock_item,id:found.id, remove:!found.remove} ])
        }
        else{
          if(max ){
            if(value.length < max)
              this.onChange([...value, {stock_item:d.id}])
            else{
              message.warning('you have max length')
            }
          }
          else{
            this.onChange([...value,{stock_item:d.id}])
          }
        }
    }
  
    
    renderOptions = () => {
        const { list, field ,disabled=[]} = this.props
        return map(list, (d,idx) => {
            const found =find (filter(field.value ,v=>!v.remove), s=>s.stock_item==d.id )
            return <button disabled={disabled.includes(d.id)?true:false  }
             key={idx} type="button" className={found&& "active" } onClick={this.onClick.bind(this, d)}>
            {d.name}</button>
        })
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
export default connect(mapStateToProps, mapDispatchToProps)(multiButtonsRemoved);