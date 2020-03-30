import React, { Component } from 'react'
import { connect } from 'react-redux'
import menuStyle from './menu_style.less'
import { withRouter } from 'react-router-dom';
import mapDispatchToProps from 'helpers/actions/main'
import { map, isEmpty, get } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
console.log(mapDispatchToProps)

export class Sub extends Component {

    state = {
        rowDisplay: 'none',
        icon: 'chevron-down'
    }
    subOnClickHandle = (eSub) => {
        const { history, setAll, Nav_location , active} = this.props
        const { rowDisplay } = this.state
        if (eSub.sub) {
            if(eSub.last){
                const data = eSub.sub[0];
                let activeApp = get(active, data.reduxName, '')
                setAll([
                    {type: 'set_main', app: 'apps', data: { active: data, Nav_location: [...Nav_location, eSub.name, data.name] }},
                    {type: 'set_main', app: 'application_settings', data: { navMenuCollapsed: true }},
                    {type: 'set_main', app: activeApp, data: {active: ''}}
                ])
                history.push('/app' + data.path)
            }else{
                if (rowDisplay == 'block') {
                    this.setState({ rowDisplay: 'none', icon: 'chevron-down' })
                }
                else {
                    this.setState({ rowDisplay: 'block', icon: 'chevron-up' })
                }
            }
        }
        else {
            let activeApp = get(active, 'reduxname', '')
            setAll([
                {type: 'set_main', app: 'apps', data: { active: eSub, Nav_location: [...Nav_location, eSub.name] }},
                {type: 'set_main', app: 'application_settings', data: { navMenuCollapsed: true }},
                {type: 'set_main', app: activeApp, data: {active: ''}}
            ])
            history.push('/app' + eSub.path)
        }

    }

    subSelectedAppMenuCollapse = () => {
        this.setState({
            display: 'block',
            icon: 'chevron-up'
        })
    }

    renderSub(eSub, mainIndex) {
        const { history, selectedAppMenuCollapse, setMain, setAll, Nav_location } = this.props
        return map(eSub.sub, (d, index) => <Sub
            key={index}
            index={mainIndex + 1}
            eSub={d}
            Nav_location={[...Nav_location, eSub.name]}
            subSelectedAppMenuCollapse={this.subSelectedAppMenuCollapse}
            {...{ history, selectedAppMenuCollapse, setMain, setAll }}

        />)
    }
    
    componentDidUpdate() {
        let { eSub, active, setMain, Nav_location } = this.props
        // if(this.pathname != this.props.history.location.pathname){
        //     this.updateAppSettings(this.props)
        // }
        if (this.props.Nav_location.length && eSub.name == get(active, 'name', '')) {
            setMain('apps', { Nav_location: [...Nav_location, eSub.name] })
        }

    }

    render() {
        const { eSub, active, index } = this.props
        const { rowDisplay, icon } = this.state
        const style = {
            paddingLeft: (index * 10) + '%'
        };

        return (
            <div>
                <div className={get(active, 'name', '') == eSub.name ? menuStyle.SubMenu_active : menuStyle.SubMenu}
                    style={style}
                    onClick={() => this.subOnClickHandle(eSub)}>
                    {eSub ? eSub.name : undefined}
                    {(!isEmpty(eSub.sub) && !eSub.last) ?
                        <FontAwesomeIcon
                            // className={styleless.parent_icon}
                            style={{ fontSize: '0.8vw' }}
                            icon={icon} />
                        : undefined}
                </div>

                {!eSub.last && <div style={{ display: rowDisplay }}>
                    {this.renderSub(eSub, index)}
                </div>}

            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    active: get(state, 'apps.active', {}),
    location: props.history.location,
    // ...console.log(props.history.location)
})

const wrapper = connect(mapStateToProps, mapDispatchToProps)(Sub)
export default withRouter(wrapper)