import React, { Component } from 'react'
import classes from './style.less'
import Shape from './shape'
export default class Shapes extends Component {
  render() {
    return (
     <div className={classes.shapesContainer}>
     <p>shapes</p>
        <div>
        <Shape shape='rectangle' label ='rectangle'></Shape>
        <Shape shape='circle' label ='rectangle'></Shape>
        <Shape shape='square' label ='rectangle'></Shape>
        </div>
     </div>
    )
  }
}
