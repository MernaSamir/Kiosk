import React, { Component } from 'react'
import BasicInfo from './tabs/basic';
import Notes from './tabs/notes';
import Deposit from './tabs/deposit';
import Products from './tabs/menu/index';

import Render from 'helpers/functions/field_mapper/renderfields'
import { get } from 'lodash'
const tabs = {
  '0': BasicInfo,
  '1': Products,
  '2': Deposit,
  '3': Notes
}
export default class Tabs extends Component {

  render() {
    const { active , values} = this.props
    const Component = get(tabs, active)
    return (
        <div style={{height:"76vh"}}>
          <Component  values={values} />
        </div>
    )
  }
}
