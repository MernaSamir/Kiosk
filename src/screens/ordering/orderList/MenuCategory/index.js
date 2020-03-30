import React, { Component } from "react";
import ListComponent from './list';
import Header from './header';
import Popups from 'screens/Popups'
import classes from './style.less'

export default class MenuCategory extends Component {

  render() {
    const { match, option } = this.props
    return (
      <div className={classes.root}>
        <Header option={option} />
        <ListComponent match={match} option={option} />
        <Popups option={option} />
      </div>
    );
  }
}
