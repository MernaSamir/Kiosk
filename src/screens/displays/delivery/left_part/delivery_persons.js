import React, { Component } from 'react'
import DeliveryPerson from './delivery_person';
import classes from './style.less'
import Buttons from './buttons';

export default class DeliveryPersons extends Component {

  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <>
        <DeliveryPerson />
        <Buttons />
      </>
    )
  }
}