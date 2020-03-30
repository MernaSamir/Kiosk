import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Noop from 'helpers/components/noop'
import SubscribeApp from 'helpers/components/app'
import {stores} from 'store/reducers'
import Performance from 'helpers/components/performance'
class AppsSubscribes extends Component {
    renderApps(){
        const {apis} = this.props;
        if(apis){
            return stores.map(d=>{
                const MainComponent = SubscribeApp(Noop, d);
                return <MainComponent key={d} />
            })
        }
    }
    render() {
        return <>
            {this.renderApps()}
        </>
    }
}
const mapStateToProps = (state) => ({
    apis: state.apps.apis
})
export default connect(mapStateToProps, mapDispatchToProps)(Performance(AppsSubscribes, ['apis']))


