import React, { Component } from 'react';
import {get} from 'lodash';
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import applyFilters from 'helpers/functions/filters';
import Performance from 'helpers/components/performance'

export default function Authorize(WrappedComponent, compare){
    class MainComponent extends Component{
        getAuth(){
            const {user} = this.props;
            applyFilters({
                key: "permission__some",
                params: user,
                compare
            })
        }
        render() {
           return <WrappedComponent {...this.props} />
        }

    }
    return connect((state, props)=>({
        user: get(state.auths__users, state.auths__users.active, {})
    }), mapDispatchToProps)(Performance(MainComponent), ["user"])
}
