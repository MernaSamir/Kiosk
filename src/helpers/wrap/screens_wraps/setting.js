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
            const { setMain, history } = this.props
            history.push('/home')
           
                setMain('form_actions', { 'mode': d.name })

        }
        setLanguage = (lang) => {
            const { setMain } = this.props
            this.setState({
                active: lang
            })

            setMain("dropdowns__lang", { active: lang || 'EN' })
        }
        render() {
            const { lang, mode } = this.props
            console.log(mode,"mmmmmmmmmm")
            const sub_modes = applyFilters({
                key: 'Filter',
                path: 'settings__sub_mode',
                params: {
                    mode
                }
            })
            console.log(sub_modes,"subbbbbbbb")

            return <Component
                handelstart={this.handelstart}
                setMode={this.setMode}
                setLanguage={this.setLanguage}
                lang={lang}
                sub_modes={sub_modes}
                mode={mode}


            />
        }
    }
    const mapStateToProps = (state, props) => ({
        lang: state.dropdowns__lang.active,
        mode:state.settings__mode.active,

    })
    return connect(mapStateToProps, mapDispatchToProps)(SettingWrap);


}
