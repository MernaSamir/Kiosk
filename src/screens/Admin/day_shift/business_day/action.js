import React, { Component } from 'react'
import classes from '../style.less'
import mapDispatchToProps from 'helpers/actions/main'
import {connect} from 'react-redux'
import moment from 'moment';
import {find, get} from 'lodash';

class ActionButton extends Component {
    constructor(props) {
        super(props);
        
        
    }


    handleSuccess = (data) => {
        // const { setMain, app } = this.props;
        // setMain(app, { active: data.end_time ? '' : data.id })
    }

    handleClick = () => {
        const { setMain, item, station, app, business_days, gun, bd } = this.props;
        if (item.id) {
            setMain(app, {item:{
                id: item.id,
                action: 'update',
                end_time: new Date(),
                onSuccess(){
                    if(gun){
                        gun.get('loc').get(station.location).get(bd).put({"fired":null})
                        
                    }
                    return [
                        {type: `set_path_${app}`, path: 'active', data: ''},
                    ]
                }
            }})
        }
        else {
            const bd = find(business_days, d=>(moment().diff(d.business_day, 'day')==0))
            if(bd){
                setMain(app, {item:{
                    id: bd.id,
                    action: 'update',
                    location: station.location,
                    end_time: null,
                    onSuccess: this.afterCreate
                }})
            }else{
                setMain(app, {item:{
                    action: 'add',
                    business_day: moment().format('YYYY-MM-DD'),
                    location: station.location,
                    start_time: new Date(),
                    onSuccess: this.afterCreate
                }})
            }
        }
    }
    afterCreate = (item)=>([{
        type: `set_path_${this.props.app}`, path: 'active', data: item.id
    }])
    changeBorder = (id) => {
        let style = 'solid 1px rgba(112, 112, 112, 0.46)'
        if (id)
            return style = 'solid 1px #d73f7c'
        return style
    }

    changeColor = (id) => {
        let color = '#000000'
        if (id)
            return color = '#d73f7c'
        return color
    }

    render() {
        const { text, item = {}, disabled ,t} = this.props
        return (
            <button type="button" className={classes.btn} onClick={this.handleClick}
                style={{
                    opacity: disabled ? '0.3' : '1',
                    border: this.changeBorder(item.id),
                }} disabled={disabled}>
                <p style={{ color: this.changeColor(item.id) }}>
                    {t(`${item.id ? "End" : "Start"} ${text}`)}
                </p>
            </button>
        )
    }
}

export default connect((state)=>({
    business_days: state.orders__business_days.data,
    station: get(state.licensing__station.data, state.licensing__station.active, {}),
    gun :get (state.guns, 'loc', ''),
    bd: state.orders__business_days.active
}), mapDispatchToProps)(ActionButton)
