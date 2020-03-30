import React, { lazy, Component, Suspense } from 'react'
const Info = lazy(()=>import('./basic'));
const Contacts = lazy(()=>import('./contact'));
const Address = lazy(()=>import('./address'));

import parties__extra_info from './extra';
import { get } from 'lodash'
// import classes from './style.less';
const tabs = {
  '0': Info,
  '1': Contacts,
  '2': Address,
  '3': parties__extra_info

}
export default class BasicInfo extends Component {
  
  render() {
    const { active, values, handleChange, setValues} = this.props
    const Component = get(tabs, active)
    return (
        <div style={{height:'76vh'}}>
          <Suspense fallback={<></>}>
            <Component index={Number(active)} handleChange={handleChange}
            values={values} setValues={setValues}/>
          </Suspense>
        </div>
    )
  }
}
