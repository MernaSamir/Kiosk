import React, { Component } from 'react'
import classes from './style.less'
import applyFilters from 'helpers/functions/filters'
import Details from 'printing/components/reports_details'
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux';
import Settings from './settings'
import axios from 'axios'
import { get, mapValues, reduce, isEqual, pick } from 'lodash'
import {withTranslation} from 'react-i18next'

class Report extends Component {

    constructor(props) {
        super(props);
        this.getBD()
        if (props.settings.generateAtStart) {
            this.generateReport(props)
        }
    }

    componentWillUnmount() {
        const { setMain } = this.props
        setMain('report', { filters: {}, data: {}, raw_data: {} })
    }

    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['reportSetting']
        if (!isEqual(pick(nextProps, compare), pick(this.props, compare))) {
            this.generateReport(nextProps)
        }
        return !isEqual(nextProps, this.props);
    }

    async getBD() {
        this.datas = applyFilters({
            key: 'multiData',
            cols: {
                bds: { reduxName: 'orders__business_days' }
            }
        })
        this.business_days = [get(this.datas.bds, this.props.active)]
    }

    generateReport = async (props) => {
        const { reportSetting, setMain, group_by, models_, settings } = props
        setMain('report', { loading: true })
        const models = mapValues(models_, (v1, k) => {
            return {
                // eslint-disable-next-line complexity
                filter: {
                    ...v1.filter,
                    ...reduce(reportSetting, (o, v, k)=>{
                        const data = get(v1, `keys.${k}`);
                        if(!data || !v){
                            return o
                        }
                        return {...o, [data.key]: v }
                    }, {})
                }
            }
        })

        return axios.post('/api/v1/analysis/', { group_by, models }).then(data => {
            const final = applyFilters({
                key: 'build_childs'
            }, data.data, undefined, { levels: [...settings.levels] })
            // console.log('bo', final)
            if (settings.raw_data) {
                setMain('report', { data: final, raw_data: data.data, loading: false, name: settings.name })
            }
            setMain('report', { data: final, loading: false, name: settings.name  })
        }).catch(()=>console.log('multiRequest Failed'))
    }

    // eslint-disable-next-line class-methods-use-this
    renderReport() {
        const { settings ,t} = this.props;
        return <Details settings={settings} t={t}/>
    }
    
    render() {
        const { settings ,t} = this.props
        return (
            <div className={classes.header_container}>
                <div className={classes.control_container}>
                    <Settings settings={settings} t={t}/>
                    <div className={classes.inner}>
                        {this.renderReport()}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect((state) => ({
    active: state.orders__business_days.active,
    reportSetting: get(state.report, 'filters', {}),
}), mapDispatchToProps)(withTranslation()(Report))