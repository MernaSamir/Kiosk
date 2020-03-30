import React, { Component } from 'react'
import BasicInfo from './tabs/basic';
import Notes from './tabs/notes';
import Deposit from './tabs/deposit';
import Menu from './tabs/menu/index';
import { get } from 'lodash'
const tabs = {
  '0': BasicInfo,
  '1': Menu,
  '2': Deposit,
  '3': Notes
}
export default class Tabs extends Component {


  render() {
    const { active,values } = this.props
    const Component = get(tabs, active)
    return (
        <div style={{height:"76vh"}}>
          <Component   values ={values}/>
        </div>
    )
  }
}
