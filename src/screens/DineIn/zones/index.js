import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {get, first, map, isEqual, pick} from 'lodash';
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters'
import {connect} from 'react-redux'
import classes from './style.less'
class Zones extends Component {
    constructor(props) {
        super(props);
        this.getData(props)
    }
    getData(props){
        const {setMain, floor_id, mode} = props;
        let params
        if(mode == 'reservation'){
            params = {
                floor_id,
                sub_mode:null
            }
        }
        else {
            params= {
                floor_id
            }
        }
        this.list = applyFilters({
            key: 'Filter',
            path: 'dinin__zones',
            params
        })
        setMain('dinin__zones', {active: get(first(this.list), 'id')})
    }
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['floor_id']
        const su = !isEqual(pick(nextProps, compare), pick(this.props, compare))
        if(su){
            this.getData(nextProps)
        }
        return !isEqual(nextProps, this.props);
    }
    selectZone = (active)=>{
        const {setMain} = this.props;
        setMain('dinin__zones', {active})
    }
    renderZones = () => {
        const { currentZone } = this.props
        return map(this.list, (d, key) => {
            return <button
                key={key}
                type="button"
                className={d.id==currentZone? classes.active:''}
                onClick={this.selectZone.bind(this, d.id)}
            >
                 <span> {d.name} </span>
            </button>

        })
    }
  render() {
    return (
        <div className={`btn-div ${classes.zones}`}>
            {this.renderZones()}
        </div>
    )
  }
}
const mapStateToProps = (state) => ({
    currentZone: state.dinin__zones.active,
    floor_id: state.dinin__floors.active
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Zones))


