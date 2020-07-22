import React, { Component } from 'react';
import {connect} from 'react-redux'
import {isEmpty, get, map, find, reject, filter, isUndefined} from 'lodash'
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
      console.log(value,"vvvvvv")
      const {field} = this.props;
      field.onChange({
        target: {
          name: field.name,
          value
        }
      })
    }
    onClick  (d){
     console.log("hnaaaaaaaaaaaa") 
        const {field, max} = this.props;
        const value = isEmpty(field.value) ? []:field.value;
        console.log(value,"vvvaaaa")
        const found = find(value, v=>(v.stock_item == d.id));
  console.log(found,"foooooo")
        if(!isUndefined(found)){
       console.log("hnaaaa hnaaaa") 
         this.onChange([...reject(value, v=>(v.stock_item==found.stock_item))])
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
            console.log("geeeeet honnnnn") 
            this.onChange([...value,{stock_item:d.id}])
          }
        }
    }
  
    
    renderOptions = () => {
        const { list, field ,disabled=[]} = this.props
        return map(list, (d,idx) => {
            const found =find (filter(field.value ,v=>!v.remove), s=>s.stock_item==d.id )
            // console.log(found,"fsff,", field.value,d)
            return <button disabled={disabled.includes(d.id)?true:false  }
             key={idx} type="button" className={found&& "active" } onClick={this.onClick.bind(this,d)}>
            {d.name}</button>
        })
    }
    render() {
    console.log("oyaaaaaaaaaaa 3almbject") 
        const { className}=this.props
        return (
            // <div  className={className}>
                this.renderOptions()
            // </div>
        );
    }
}
const mapStateToProps = (state, props)=>
({list: props.options || get(state, `${get(props.app, 'name', '')}.data`, {})})
export default connect(mapStateToProps, mapDispatchToProps)(multiButtonsRemoved);