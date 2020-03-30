import React, { Component } from 'react'
import BasicComponent from 'helpers/components/basic';
import { mapValues } from 'lodash';
import MainAction from 'helpers/actions/button'
export default class LinkedInput extends Component {
    constructor(props){
        super(props);
        const {extraFuns} = props;
        if(extraFuns){
            // debugger
            this.compares = mapValues(extraFuns, d=>({...d, action: this.takeAction}))
        }
        // this.compares={}
    }
    resetChanging(){
        setTimeout(()=>{
            this.changing = false
        }, 50)    
    }
    takeAction = (props, action)=>{
        if(!this.changing){
            this.changing = true
            MainAction(action, props)
            this.resetChanging()

        }
    }
   
    render() {
        if(!this.compares){
            return this.props.children
        }
        return (
            <BasicComponent {...this.props} compare={this.compares}>
                {this.props.children}
            </BasicComponent>
        )
    }
}
