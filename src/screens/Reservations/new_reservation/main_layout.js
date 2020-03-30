import React, { Component } from 'react'
import BasicInfo from './tabs/basic';
import Notes from './tabs/notes';
// import Render from 'helpers/functions/field_mapper/renderfields'
import { get } from 'lodash'
const tabs = {
  '0': BasicInfo,
  '1': Notes,
}
export default class Tabs extends Component {


  render() {
    const { active } = this.props
    const Component = get(tabs, active)
    return (
      <div >
        <Component  />
      </div>
    )
  }
}
