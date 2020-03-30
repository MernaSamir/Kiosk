import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './style.less'
import CollapseRow from './Collapse/row'
import { get, map } from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilter from 'helpers/functions/filters'
export class list extends Component {

  renderItems = () => {
    const { parentData, list, msg } = this.props;
    const filter = list.filter || { key: 'list', select: {} };
    const data = applyFilter(filter, parentData.data);
    return map(data, (d, i) => {
      return <CollapseRow
        key={i}
        item={d}
        msg={msg}
        child={list.child || {}}
      />
    })

  }

  render() {
    return (
      <div className={style.collapse_div}>
        {this.renderItems()}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    list: get(state, 'apps.active.tableList', {}),
    msg: get(state, 'apps.active.msg', undefined),
    get parentData() { return get(state, `${this.list.reduxName}`, {}) },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(list)
