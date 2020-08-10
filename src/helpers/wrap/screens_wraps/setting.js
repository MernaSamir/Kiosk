import React from 'react'
import applyFilters from 'helpers/functions/filters';
import { multiRequest } from 'helpers';
import { min, isEqual, pick, get } from 'lodash'
import mapDispatchToProps from "helpers/actions/main";
import { connect } from "react-redux";

export default (Component, props = {}) => {
    class SettingWrap extends React.Component {
        handelstart = () => {
            const { history } = this.props;
            history.push("/home");
        };

        setMode = (d) => {
console.log(d,"moooooooooodddddddd")
            const { setMain, history } = this.props
            history.push('/home')
            const mode = applyFilters({
                key: 'Find',
                path: 'settings__mode.data',
                params: {
                    name: d.mode
                }
            })
        setMain('form_actions', { 'mode': d.title })
            if (d.mode) {
                setMain('settings__mode', { 'active': mode.id })
            }
        }
        setLanguage = (lang) => {
            const { setMain } = this.props
            this.setState({
                active: lang
            })

            setMain("dropdowns__lang", { active: lang || 'EN' })
        }
        render() {

            const { lang } = this.props

            return <Component
                handelstart={this.handelstart}
                setMode={this.setMode}
                setLanguage={this.setLanguage}
                lang={lang}


            />
        }
    }
    const mapStateToProps = (state, props) => ({
        lang: state.dropdowns__lang.active,

    })
    return connect(mapStateToProps, mapDispatchToProps)(SettingWrap);


}
