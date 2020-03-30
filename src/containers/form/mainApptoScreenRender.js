import React, { Component } from 'react'
import { connect } from 'react-redux'
import ScreenRender from './screen_render'
import mapDispatchToProps from 'helpers/actions/main'
import { get , isEmpty} from 'lodash'
import {apps_apis} from 'helpers/apps/apps'

class mainApptoScreenRender extends Component {
    componentDidMount = () => {
        const { setMain } = this.props
        apps_apis().then(d=>{
            return setMain('apps', {'api':d})
         })
    }

    getComponent() {
        let { appSettings, match, setAll, activeItem } = this.props
        const reduxName = appSettings.reduxName;
        // console.log(match, reduxName)
        // if (store) {
        // this.getData()
        let MainComponent = ScreenRender
        if(match.params.item != activeItem){
            let dis = [
                {app: reduxName, type: 'set_main', data: {active: match.params.item}},
                {app: 'form', type: 'reset_all'}
            ]
            setAll(dis)
        }
        // let component = MainComponent;
        return MainComponent
        // }
    }
    render() {
        let Components = null
        if(!isEmpty(this.props.apis)){
            Components = this.getComponent()
        }
        return (
            <>
                {Components && <Components />}
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        appSettings: get(state, 'apps.active', {}),
        apis: get(state , 'apps.api' , {}),
        get activeItem(){return get(state, `${this.appSettings.reduxName}.active`)}
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(mainApptoScreenRender)
