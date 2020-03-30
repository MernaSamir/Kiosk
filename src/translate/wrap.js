import React, {Component} from 'react'
import { connect } from 'react-redux'
import {get} from 'lodash'
import axios from 'axios'
import mapDispatchToProps from 'helpers/actions/main'


const mapStateToProps = (state)=>({
    default_lang: get(state.main.user, 'lang', state.dropdowns__lang.active)
})
export default function(MainComponent){
    class Translate extends Component{
        constructor(props){
            super(props);
            this.getLang()
            this.data = null
        }
        getLang = ()=>{
            const {default_lang} = this.props;
            if(default_lang){
                axios.post('/api/v1/lang/').then(({data})=>{
                    this.data=data
                    this.props.setMain('lang', {
                        translate: get(data, default_lang),
                        trans: data,
                    })
                })
            }
        }
        updateLang = ()=>{
            const {default_lang} = this.props
            if(this.data && default_lang){
                this.props.setMain('lang', {
                    translate: get(this.data, default_lang),
                })
            }
        }
        render(){
            this.updateLang()
            return <MainComponent />
        }
    }
    return connect(mapStateToProps, mapDispatchToProps)(Translate)
}