import React, { Component } from 'react'
import Dropdown from 'components/dropdown'
import {first, get} from 'lodash';
import {withRouter} from 'react-router-dom'
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters'
import {connect} from 'react-redux'

class Floors extends Component {
    constructor(props) {
        super(props);
        const {setMain} = this.props;
        this.list = applyFilters({
            key: 'Filter',
            path: 'dinin__floors',
            params: {}
        })
        if(!props.active){
            setMain('dinin__floors', {active: get(first(this.list), 'id')})
        }
        this.state = {};
    }

    handelFloorChange = (active) => {
        const {setMain} = this.props
        setMain('dinin__floors', {active})
    }
    render() {
        const {active , containerClass, t} = this.props
        return (
            <div className={containerClass?containerClass:classes.floor}>
                <span>{t('Floor')}</span>
                <Dropdown
                    data={this.list}
                    btnClass={classes.button}
                    clickedclass={classes.buttonClicked}
                    onChange={this.handelFloorChange}
                    value={active}
                >
                </Dropdown>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    active: state.dinin__floors.active
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Floors))
