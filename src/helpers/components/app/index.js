import React, { Component } from 'react'
import AppComponent from './component';
import {get} from 'lodash';
import mapDispatchToProps from 'helpers/actions/main'
import {connect} from 'react-redux';
// import Performance from 'helpers/components/performance'
export default function WrapApp(WrappedComponent, app){
    class MainComponent extends Component {
        render() {
            return <AppComponent {...this.props} app={app}>
                <WrappedComponent app={app} />
            </AppComponent>
        }
    }
    const mapStateToProps = (state)=>({
        // action: get(state, `${app}.item.action`, ''),
        item: get(state, `${app}.item`, {}),
        afterAction: get(state, `${app}.afterAction`, () => ([]))
    })
    const AppCompo = connect(mapStateToProps, mapDispatchToProps)(MainComponent);
    return AppCompo;
}
