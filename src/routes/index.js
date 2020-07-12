import { HashRouter, Route } from 'react-router-dom';
import React, { lazy, Suspense } from 'react'
import { connect } from 'react-redux'
import Loading from "helpers/components/loading";
const Login = lazy(() => import('containers/LogIn'))
const Licensing = lazy(() => import('containers/licensing'))
const Setup = lazy(() => import('containers/licensing/station_setup'))
import { get, map } from 'lodash';
import Performance from 'helpers/components/performance'
import axios from 'axios'
const AppRouting = lazy(() => import('./routes'))
const AnotherRouting = lazy(() => import('./web_routes.js'))

import mapDispatchToProps from 'helpers/actions/main'
import LicenceError from 'imports/field/components/License_error_msg'
import wComponent from 'helpers/components/watcher';
import applyFilters from 'helpers/functions/filters'
import loadApps from './apps';
import { multiRequest } from 'helpers'
import initFun from 'helpers/functions/init'
import UserQuery from 'containers/LogIn/user';
import uuid from 'uuid/v4'
// import { isDesktop, isMobile } from 'config';
import { isMobile, isDesktop } from 'react-device-detect';

const Start_screen = lazy(() => import('screens/start'))

class Routes extends wComponent {
    state = {}
    getWatcher = () => {
    }
    setApps(apis) {
        const { setMain } = this.props;
        setMain('apps', {
            apis: map(apis, (d, i) => ({
                api: i + '/',
                name: i.replace(/-/g, '_').replace(/\//g, '__'),
                get app() { return this.name }
            })).reduce((o, v) => ({ ...o, [v.name]: v }), {})
        })
    }
    initActives = (...props) => {
        return initFun(...props)
    }
    getMac = async (err, mac_address = localStorage.getItem('deviceId')) => {
        if (!mac_address && Boolean(window.cordova)) {
            mac_address = window.device.uuid;
            localStorage.setItem('deviceId', mac_address)
        }
        if (!mac_address) {
            if (window.electron) {
                mac_address = uuid()
                localStorage.setItem('deviceId', mac_address)
            } else {
                mac_address = 'test'
            }
        }


        const { user } = this.props;
        try {
            const { data: apis } = await axios.get('/api/v1/')
            this.setApps(apis)
            const { data } = await axios.get('/api/v1/licensing/station/', { params: { mac_address } })
            const station = get(data, 'results[0]', '');
            // console.log(data, station)
            await multiRequest(loadApps(station), this.initActives.bind(this, station, data.results))
        } catch{
            mac_address = ''
            // console.log("Error")
        }
        this.setState({
            Loaded: true
        })
        this.setSettings()
        const Token = localStorage.getItem('tk')
        if (!user && Token) {
            this.getUser(Token)
        }

    }
    setSettings = () => {
        const { setMain } = this.props;
        const data = applyFilters({
            key: 'keys',
            path: 'settings__filter',
            levels: ['station', 'mode', 'key'],
            select: 'value'
        }, undefined, undefined, { defaults: { menuShow: 'true', fontSize: '1.5' } })
        setMain('main', { pos_settings: data })
    }
    constructor(props) {
        super(props);
        const { station } = this.props;
        if (!station) {
            get(window.func, 'mac', (d) => (d()))(this.getMac);
        }

    }
    async getUser(Token) {
        const { setMain } = this.props
        const data = await multiRequest(UserQuery(Token))
        setMain('main', { current: get(data, 'auths__user[0]') });
    }

    checkLicense = () => {
        const di = localStorage.getItem('device_id') || true

        if (!di) {
            return (
                <HashRouter>
                    <Suspense fallback={<Loading />}>
                        <Route exact path="/" component={Licensing} />
                        <Route exact path="/setup" component={Setup} />
                    </Suspense>
                </HashRouter>
            )
        }
        else {
            const { station } = this.props
            const { Loaded } = this.state
            if (!Loaded) {
                return <Loading />
            }
            if (station) {
                return (
                    <HashRouter>
                        <Suspense fallback={<Loading />}>
                            <Route exact path="/" component={Login} />
                            {this.renderRoutes()}
                        </Suspense>
                    </HashRouter>
                )
            }
            return <LicenceError />
        }
    }
    render() {
        if (isMobile) {
          console.log("mobbbbbbi")
            return <section>
                <HashRouter>
                    <Suspense fallback={<Loading />}>
                        {/* <Route exact path="/user" component={Login} /> */}
                        <Route path="/" component={AppRouting} />

                    </Suspense>
                </HashRouter>
            </section>
        }
        else {
            return <section>
                <HashRouter>
                    <Suspense fallback={<Loading />}>
                        {/* <Route exact path="/user" component={Login} /> */}
                        <Route path="/" component={AnotherRouting} />

                    </Suspense>
                </HashRouter>
            </section>
        }
    }


}

const mapStateToProps = (state) => ({
    user: get(state, 'main.current', ''),
    station: state.licensing__station.active,
    // watch: {},
    interval: 10000,
})

export default connect(mapStateToProps, mapDispatchToProps)(Performance(Routes, ['user', 'station']))
