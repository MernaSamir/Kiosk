import React, { Component } from 'react'
import classes from './style.less'
import Header from './header';
import Body from './body';
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import {withRouter} from 'react-router-dom';
import applyFilter from 'helpers/functions/filters'
import { get } from 'lodash';
class SelectChain extends Component {
  // eslint-disable-next-line class-methods-use-this
  constructor(props){
    super(props)
    const { history, setMain } = props
    if(props.station.call_center){
      const chains = applyFilter({
        key: 'Array',
        path: 'licensing__chain.data',
      })
      if(chains.length == 1){
        const element = chains[0];
        setMain('licensing__chain', { active: element.id })
        history.push(`/call_center/${element.name}`)
      }
    }else{
        setMain('licensing__chain', { active: props.location.chain })
        history.push(`/call_center/${props.location.chain}`)
    }
  }
  render() {
    return (
      <div className={classes.container}>
        <div className={classes.inner}>
          <Header />
          <Body />
        </div>
      </div>
    )
  }
}

export default withRouter(connect((state)=>({
  station: get(state.licensing__station.data, state.licensing__station.active, {}),
  location: get(state.licensing__location.data, state.licensing__location.active, {})
}), mapDispatchToProps)(SelectChain))
