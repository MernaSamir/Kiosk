import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './style.less'
import { Tabs } from "antd";
import Layout from './../layouts'
import mapDispatchToProps from 'helpers/actions/main'
import { pick, get, find, first, isEqual } from 'lodash'

const TabPane = Tabs.TabPane;

export class TabsHolder extends Component {
    state = {
        disabled: false
    }

    static getDerivedStateFromProps(props, state) {
        // Re-run the filter whenever the list array or filter text change.
        // Note we need to store prevPropsList and prevFilterText to detect changes.
        const key = props.appSettings.disabledKey
        if (props.activeItem) {
            const temp = find(props.appSettings.tabs, { key: get(props.activeItem, key) })
            props.handleChange({ target: { name: `extra.${key}`, value: temp.key } })
            return {
                activeTab: isEqual(get(props.values, `extra.${key}`), temp.key) && temp.key
            };
        }
        if (!state.activeTab && !props.activeItemId) {
            const activeTab = first(props.appSettings.tabs).key;
            // this.changeTab(activeTab)
            props.handleChange({ target: { name: `extra.${key}`, value: activeTab } })
            return {
                activeTab
            };
        }

    }
    componentDidUpdate(prevProps, prevState) {
        const compare = ['values.extra', 'activeItem']
        // if(this.props.values.extra){
        const su = !isEqual(pick(this.props, compare), pick(prevProps, compare));
        if(su){
            this.updateForm(this.props.values)
        }
        // }
    }
    
    updateForm(values){
        const {appendPath} = this.props;
        appendPath('form', 'extra', values.extra)
    }
    TabsMap(appSettings, props, activeItem){
        if(appSettings.tabs){
            return (appSettings.tabs || []).map((d, index) => {
                return <TabPane
                    tab={d.name}
                    key={d.key}
                    name={d.name}
                    disabled={get(activeItem, appSettings.disabledKey, false)}
                >
                    <Layout {...props} tabKey={d.key} />
                </TabPane>
            })
        }
    }
    renderTabs = (props) => {
        const { appSettings, activeItem = {}, activeItemId } = this.props
        if (!activeItemId) {
            return this.TabsMap(appSettings, props, activeItem)
        }else if(activeItem.id == activeItemId){
            return this.TabsMap(appSettings, props, activeItem)
        }
    }
    changeTab = (activeTab) => {
        const { handleChange, appSettings } = this.props
        const key = appSettings.disabledKey
        handleChange({ target: { name: `extra.${key}`, value: activeTab } })
        this.setState({ activeTab })
    }

    // shouldComponentUpdate(nextProps, nextState){
    //     const stateCompare = ["activeTab"]
    //     return !isEqual(pick(this.state, stateCompare), pick(nextState, stateCompare));
    // }
    render() {
        const { handleBlur, handleChange } = this.props
        const { activeTab } = this.state
        return (
            <div className={style.form}>
                <Tabs
                    activeKey={activeTab}
                    style={{ fontSize: '1vw' }}
                    animated={false}
                    onChange={this.changeTab}
                    disabled
                >

                    {this.renderTabs({ handleBlur, handleChange })}

                </Tabs>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    get appSettings() { return get(state, 'apps.active', {}) },
    get activeItemId() { return get(state, `${this.appSettings.reduxName}.active`, '') },
    get activeItem() { return get(state, `${this.appSettings.reduxName}.data.${this.activeItemId}`) },
    formValues: state.form.extra
})



export default connect(mapStateToProps, mapDispatchToProps)(TabsHolder)
