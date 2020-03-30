import React, { Component } from 'react'
import applyFilters from 'helpers/functions/filters';
import BasicComponent from 'helpers/components/basic';
import { get, map, flatten } from 'lodash';
export default class LinkedInput extends Component {
    constructor(props){
        super(props);
        const {linked} = props;
        
        if(linked){
            this.compares = {
                current: {
                    compare: ['field.value', 'mainValue'],
                    action: this.updateCompareField
                },
                compares: {
                    compare: flatten(map(linked.compares, d=>([`mainValues.${d}`, `values.${d}`]))),
                    action: this.updateCurrentField
                }
            }
        }
        // this.compares={}
    }
    resetChanging(){
        setTimeout(()=>{
            this.changing = false
        }, 50)    
    }
    updateCurrentField = ()=>{
        if(!this.changing){
            const {linked={}, field, form, mainValues=form.values, mainChange=field.onChange} = this.props;
            const val = applyFilters(linked.current, mainValues)
            if(val != field.value){
                this.changing = true
                mainChange({
                    target: {
                        name: field.name,
                        value: val
                    }
                })
                this.resetChanging()
            }
        }
    }
    updateCompareField = ()=>{
        if(!this.changing){
            const {linked={}, field, form, mainValues=form.values, mainChange=field.onChange} = this.props;
            const val = applyFilters(linked.link, mainValues)
            if(val != get(mainValues, linked.name)){
                let name = field.name.split('.')
                name.pop()
                name.push(linked.name)
                name = name.join('.')
                mainChange({
                    target: {
                        name,
                        value: val
                    }
                })
            }
            this.resetChanging()
        }
    }
    render() {
        if(!this.compares){
            return this.props.children
        }
        // console.log(this.compares)
        return (
            <BasicComponent {...this.props} compare={this.compares}>
                {this.props.children}
            </BasicComponent>
        )
    }
}
