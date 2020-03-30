import React, { Component } from 'react';
import {get} from 'lodash'
import applyFilter from 'helpers/functions/filters/';
import MainAction from 'helpers/actions/button'
import {connect} from 'react-redux';
const MainPermission = {
    key: 'everyFilter',
    func: []
}
class extra extends Component {
    
    takeAction = (button, data)=>{
        MainAction(button, data)
    }
    render() {
        const {button, index, data} = this.props;
        this.mainAction = this.takeAction.bind(this, button, data);
        const perms = get(button, 'permission', MainPermission);
        const show = applyFilter(perms, data)
        console.log(show, button)
        if(show){
            console.log(button, index)
            return (
                <button onClick={this.mainAction}>
                    {get(button, 'text', index)}
                </button>
            );
        }
        return <></>
    }
}
const mapStateToProps = (state, props)=>({
    from: state.form.extra,
    // updated: get(state, props.updated)
})
export default connect(mapStateToProps)(extra)
