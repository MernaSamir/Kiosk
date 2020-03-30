import React, { Component } from 'react'
import './combos.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Row from './row'
import RadioButton from './../Radio-Button/index'

export default class Combos extends Component {

  state = {
    selectall: false
  }

  selectall = () => {
    this.setState({
      selectall: !(this.state.selectall)
    })
  }

  sortAscending = (array) => {
    array.sort()
  }

  render() {
    return (
      <div className="combos">

        <div className="title">
          <p>Combos</p>
          <div>
            <button type="button">Export</button>
            <button type="button">Print</button>
          </div>
        </div>

        <div className="border"></div>

        <div className="combo-search">
          <FontAwesomeIcon icon="search" className="icon" size="sm" />
          <input className="input-combos" type="text" placeholder="Search" />
        </div>

        <div className="combo-check">

          <table className="table-backoffice">

            <tr className="table-header">
              <td className="table-mark">
                <RadioButton
                  className="selectall"
                  height="2vh"
                  width="50%"
                  borderColor="1px solid #474747"
                  radioclick={this.selectall}
                  displayinsqure={this.state.selectall} />
              </td>

              <td className="id"><span >ID</span></td>
              <td className="name"><span>Name</span></td>

              <td className="table-mark">
                <div className="sort-icon" ={() => this.sortAscending()}>
                  <FontAwesomeIcon icon="sort-alpha-down" style={{ alignSelf: "center" }} />
                </div>
              </td>

            </tr>

            {new Array(200).fill(null).map(d => {
              return <Row selectall={this.state.selectall} />
            })}

          </table>

        </div>

      </div>
    )
  }
}
