import React, { Component } from 'react'
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main'
import {connect} from 'react-redux'

class ActionButton extends Component {

    handleSuccess = (data) => {
        // const { setMain, app } = this.props;
        // setMain(app, { active: data.end_time ? '' : data.id })
    }

    handleClick = () => {
        const { setMain, item, extra = {}, app } = this.props;
        if (item.id) {
            setMain(app, {item:{
                id: item.id,
                action: 'update',
                end_time: new Date(),
                onSuccess(){
                    return [
                        {type: `set_path_${app}`, path: 'active', data: ''}
                    ]
                }
            }})
        }
        else {
            setMain(app, {item:{
                ...extra,
                action: 'add',
                start_time: new Date(),
                onSuccess(item){
                    return [
                        {type: `set_path_${app}`, path: 'active', data: item.id}
                    ]
                }
            }})
        }
    }

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

export default connect(null, mapDispatchToProps)(ActionButton)
