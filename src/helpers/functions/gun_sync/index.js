import React, { Component } from 'react'
import Gun from 'gun'

import {reduce} from 'lodash'
import store from 'store'
import {gun_hq} from 'helpers/gun'


export default class gunSync extends Component {
    all_data = {}

    componentDidMount() {
        gun_hq.get("modules").on(app => {
            reduce(app['_']['>'], (result, value, key) => {
                let app_name = key;
                gun_hq.get(key).on(items => {
                    let app_data = [];
                    
                    reduce(items['_']['>'],  (result, value, key) => {
                        gun_hq.get(key).on(val => {
                            app_data.push(val)
                        })
                    })
                    this.all_data[app_name] = app_data
                    store.dispatch({type: `set_data_${app_name}`, path: 'data', data: app_data})  
                })
            }, []);
        })            
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export const GunSync = gunSync
