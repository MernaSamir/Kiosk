import React, { Component } from 'react'
import Render from '../../../../helpers/functions/field_mapper/renderfields'
import classes from '../style.less'
const controls = {
  col1: [
      { name: 'ComplaintCategory.name', label: "Complaint Category", type: 'SelectBox' ,
      app:{
        name: "ComplaintCategory",
        api: 'dropdowns/Complaint Category'
      }},
      { name: 'ReasonType.name', label: "Reason", type: 'SelectBox', app:{
          name: "ReasonType",
          api: 'dropdowns/reason-type'
        }},],

  col2:
      [
          
          {
              name: 'family', label: "", type: 'RowForm',fields:[
                  { name: 'name', label: "Name", type: 'TextBox' },
                  { name: 'birthday', label: "Birthday", type: 'TextBox' },
                  {
                      name: 'relation_ship', label: "Relationship", type: 'SelectBox',
                      app: {
                          name: "parties__relationships",
                          api: 'parties/parties__relationships/'
                      }
                  }
              ]
          }
      ],

}
export default class SuggestionsAndComplains extends Component {
  render() {
    return (
      <div >
        
      </div>
    )
  }
}
