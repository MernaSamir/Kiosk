import React, { Component } from 'react'
import {connect} from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './style.less'
import { get } from 'lodash'
import Zone from './tables/table_grid'
import Floors from './floors'
import Zones from './zones'
import Tabs from './tabs'
import {withTranslation} from 'react-i18next'

class ViewPlanner extends Component {
    renderZone=()=>{
        const {subMode} = this.props
        if(subMode.key == 'tabs')
            return <Tabs />
        else
            return <Zone type="work"/>
    }
    render() {
        const {t} = this.props
        return (
            <div className={classes.body} >
                <div className={`${classes.contanier} ${classes.header} `}>
                    <Zones t = {t}></Zones>
                    <Floors t = {t}></Floors>
                </div>
                <div className={classes.background}>
                <div className={classes.tableGrid}>
                    <div className={classes.gridRadius}>
                        {this.renderZone()}
                        {this.props.children}
                    </div>
                </div>
                </div>
                
            </div>

        )
    }
}
const mapStateToProps = (state)=>({
    zone: get(state.dinin__zones.data, state.dinin__zones.active, ''),
    get subMode(){return get(state.settings__sub_mode.data,this.zone.sub_mode,'')}
})
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ViewPlanner))
