import React, { Component } from 'react'
import classes from './style.less'
import Header from './header'
import Card from './card';
import applyFilters from 'helpers/functions/filters';
import { map } from 'lodash';

export default class GroupDif extends Component {
  state = {
    page: 1
  }
  
  groups = applyFilters({
    key: 'Filter',
    path: "dropdowns__delivery_group",
    params: {
      active: true,
    }
  })
  renderCards = () => {
    console.log(this.groups)

    return <>
      <Card title="Delivery Persons" />,
  {map(this.groups, (d, i) => {
        return <Card title={d.name} key={i + 1} group={d}
        />
      })}
    </>
  }

  render() {
    return (
      <div className={classes.container}>
        <Header />
        <div className={classes.cards_container}>
          {this.renderCards()}
        </div>
      </div>
    )
  }
}
