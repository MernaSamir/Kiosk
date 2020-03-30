import React, { Component } from 'react'
import { connect } from 'react-redux'
import classes from '../styles.less'
import Render from 'helpers/functions/field_mapper/renderfields'
import Form from 'helpers/wrap/form.js';
import mapDispatchToProps from 'helpers/actions/main'
import { multiRequest } from 'helpers';

class stock_limits extends Component {
  static onSubmit() {

  }
  componentDidMount() {
    multiRequest({
      stock__menus: {},
      stock__categories: {},
      stock__items: {},
      stock__item_variants: {},
      licensing__chain: {},
      licensing__location: {},
    })
  }
  buttonField() {
    return Render([
      {
        type: 'TableMultiCol',
        name: "",
        apply_all: true,
        colKey: 'licensing__location',
        reduxName: 'stock__menus',
        child: {
          reduxName: 'stock__categories',
          match: 'menu',
          child: {
            reduxName: 'stock__items',
            match: 'category',
            child: {
              reduxName: 'stock__item_variants',
              match: 'item',
            }
          }
        },
        filters: {},
        cols: {
          reduxName: 'licensing__location'

        },
        fields: [
          {
            head: 'Minimum',
            name: 'minimum',
            type: 'number',
            parent: true,
            child: true
          },
          {
            head: 'Maximum',
            name: 'maximum',
            type: 'number',
            parent: true,
            child: true
          },
          {
            head: 'Leadtime(Hours)',
            type: 'number',
            name: "leadtime",
            parent: true,
            child: true
          },
        ]
      },

    ])
  }

  render() {
    return (
      <div className={classes.container}>
        {this.buttonField()}
      </div>
    )
  }
}
const mapStateToProps = (state) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(Form(stock_limits))



