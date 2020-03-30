import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import mapDispatchToProps from 'helpers/actions/main'
import { get, map, find, isEqual, pick } from 'lodash'

class BackOfficeMenu extends Component {

    constructor(props) {
        super(props)
        this.setAppPath(props)
    }
    setAppPath(props){
        let { homeApp, setMain } = props
        this.app = this.findPath(homeApp.data)
        if (this.app) {
            this.pathname = props.history.location.pathname
            this.Nav_location.push(this.app.name)
            setMain('apps', { 'name': this.app.name, active: this.active, Nav_location: [...this.Nav_location.filter(d=>d).reverse()] })
            setMain('application_settings', { navMenuCollapsed: true })
        }
    }
    shouldComponentUpdate = (nextProps, nextState) => {
        const compare = ["active", "data", "name"]
        const su = !isEqual(pick(this.props.homeApp, compare),
            pick(nextProps.homeApp, compare)
        ) || !isEqual(this.props.navMenuCollapsed, nextProps.navMenuCollapsed);
        if(this.pathname != nextProps.history.location.pathname){
            this.setAppPath(nextProps)
        }
        return su
    }


    findPath(element) {
        let { history } = this.props
        this.Nav_location = []
        return find(element, (d) => {
            const innerData = d.data || d.sub
            if (innerData) {
                const active = this.findPath(innerData)
                if(active){
                    this.Nav_location.push(active.name);
                }
                return active
            }
            const found = '/' + history.location.pathname.split('/')[2] == d.path
            if(found){
                this.active = d
            }
            return found
        })
    }

    menuListLoop = () => {
        const { homeApp } = this.props
        let Nav_location = homeApp.name
        return map((get(homeApp.data, `${homeApp.name}.data`, [])), (e, index) =>
            <BackOfficeCollapse
                element={e}
                key={index} 
                mainApp={homeApp.name}
                Nav_location={[Nav_location]}
                />
        );
    }

    handelCollapse = () => {
        const { navMenuCollapsed, setMain } = this.props
        setMain('application_settings', { navMenuCollapsed: !navMenuCollapsed })
    }

    openMenu = () => {
        const { navMenuCollapsed, setMain } = this.props
        if(navMenuCollapsed){
            setMain('application_settings', { navMenuCollapsed: !navMenuCollapsed })
        }
    }

    importAll(r) {
        let images = {};
        r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
        return images;
    }

    render() {
        return (
            <></>
        )
    }
}


const mapStateToProps = (state) => ({
    homeApp: get(state, 'apps', ''),
    navMenuCollapsed: get(state, 'application_settings.navMenuCollapsed', {}),
})


const wrapper = connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(BackOfficeMenu)
export default withRouter(wrapper)