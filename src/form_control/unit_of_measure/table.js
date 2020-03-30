import React, { Component } from 'react'
import TableData from '../../Assign_Location/Collapse_Loc/col_children'
import { Select } from 'antd'
const Option = Select.Option
export default class table extends Component {
  render() {
    return (
      <div >
        <p className='p_style'>Measure Unit Type</p>
        <Select className='unit_select'>
          <Option value='Weight'>Weight</Option>
        </Select>
        <div className='tableCont'>
          <div style={{ width: '90%', paddingLeft: '8%', display: 'flex', justifyContent: 'space-between', 
          }}><p>Name</p>
            <p>Active</p>
          </div>
          <div style={{width:'100%', borderTop: '1px solid  #931066' }}>
          <TableData name='Unit' Class='utable' />
          <TableData name='Unit' Class='utable' />
          <TableData name='Unit' Class='utable' />
          <TableData name='Unit' Class='utable' />
          </div>

        </div>
      </div>
    )
  }
}
