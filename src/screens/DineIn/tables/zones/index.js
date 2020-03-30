import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {isEqual, find, pick} from 'lodash'
import Dropdown from 'components/dropdown'
import classes from './style.less'
import applyFilters from 'helpers/functions/filters';
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
class Zones extends Component {
    getData = (props) => {
        const { setMain, floor } = props
        this.list = applyFilters({
            key: 'Filter',
            path: 'dinin__zones',
            params: {
                floor_id: floor
            }
        })
        setMain('dinin__zones', { active: find(this.list, Boolean).id })

    }
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['floor']
        const su = !isEqual(pick(nextProps, compare), pick(this.props, compare))
        if(su){
            this.getData(nextProps)
        }
        return !isEqual({props: nextProps}, {props: this.props})
    }
    constructor(props) {
      super(props);
        if(props.floor){
            this.getData(props)
        }
      this.state = {};
    }
    // componentDidUpdate(prevProps){
    //     if(!isEqual(prevProps.floor,this.props.floor)){
    //         this.getData()
    //     }
    // }
    handelZoneChange = (active) =>{
        const {setMain} = this.props
        setMain('dinin__zones', {active})
    }
    renderZones = () => {

        const { active } = this.props
        return<Dropdown
                    data={this.list}
                    btnClass={classes.button}
                    clickedclass={classes.buttonClicked}
                    onChange={this.handelZoneChange}
                    value={active}
                >
                </Dropdown>

    }
  render() {
    return this.renderZones()
  }
}
const mapStateToProps = (state) => ({
    active: state.dinin__zones.active,
    floor: state.dinin__floors.active
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Zones))


