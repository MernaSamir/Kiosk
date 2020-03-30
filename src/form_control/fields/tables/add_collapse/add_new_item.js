import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import mgStyle from './mg-style.less'
import { Collapse_col } from 'helpers/components/table';


export class add_new_item extends Component {

  renderAddNewItem = () => {
    const { add_new_item, handleSubmit, mainValues } = this.props
    return [
      <>
        <Collapse_col key="1" fields={add_new_item} mainValues={mainValues} />,
        <td key="-10" className={mgStyle.plus_div} onClick={handleSubmit}>
          <FontAwesomeIcon className={mgStyle.plus_icon} icon='plus' size="2x" />
        </td>
      </>
    ]
  }

  render() {
    return (
      <tr>
        {this.renderAddNewItem()}
      </tr>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(add_new_item)
