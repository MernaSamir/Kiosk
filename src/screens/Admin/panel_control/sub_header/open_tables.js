import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './../style.less'
import { find, map, get, reject, filter } from 'lodash'

export class OpenTables extends Component {

  componentDidMount() {
    const { fetchAll } = this.props
    fetchAll([
      {
        app: "dinin__tables",
        api: 'dinin/tables/',
        params: {
          // limit: 20,
          // order_by: '-created_at'
        }
      },
    ])
  }

  render() {
    const { tables } = this.props

    return (
      <div className={classes.col}>
        <p className={classes.title}>Open Tables</p>
        <p className={classes.value}>{Object.keys(tables).length}</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  tables: reject(get(state.dinin__tables, 'data', ''), { active: null }, {}),
})



export default connect(mapStateToProps, mapDispatchToProps)(OpenTables)
