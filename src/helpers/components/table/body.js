import React, { Component } from 'react'
import TRow from './row';
export class TBody extends Component {
  render() {
    return (
      <tbody>
            <TRow {...this.props}/>
      </tbody>
    )
  }
}
export default TBody
