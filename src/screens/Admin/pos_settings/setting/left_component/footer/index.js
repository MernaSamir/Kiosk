import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import classes from './../../style.less'
import { filter, get, map, find } from 'lodash'
import { withRouter } from 'react-router-dom'

class Footer extends Component {

    save = (obj) => {
        const { setAll, list, pos_settings, station, mode } = this.props
        let arr = []
        const rec = filter(list, (v) => Object.keys(obj).find(d =>
            (v.key == d && v.station == station && v.mode == mode)))
        // if (isEmpty(rec)) {
        //     const data = [...Object.keys(obj).map(d => (
        //         { key: d, value: obj[d], station: activeStation.id }
        //     ))]
        //     SetMain({
        //         item: {
        //             data: data,
        //             action: "bulkAdd"
        //         }
        //     })
        // }
        // else {
        const data = map(obj, (d, key) => {
            const newKey = rec.find(r => (r.key == key))
            return { ...newKey, key, value: d, station: station, mode: mode }
        })

        arr.push({
            type: 'set_main', app: 'settings__filter', data: {
                item: { action: "bulkEdit", data: data, onSuccess: this.afterAdd }
            }
        })
        arr.push({
            type: 'set_path', app: 'main', path: `pos_settings.${station}.${mode}`,
            data: { ...pos_settings, ...obj }
        })
        setAll(arr)
    }


    afterAdd = () => {
        const { history } = this.props
        history.push('/admin')
        return []
    }

    default = () => {
        // const { getFinalSettings, list, obj, station, mode } = this.props
        // const rej = filter(list, (l) => pick(obj, (o, key) => (
        //     {key: l.key , mode:l.mode , station: station}
        // )))
        // getFinalSettings({ ...obj, ...rej.key, ...rej.value })

        // getFinalSettings({...obj, })
    }

    render() {
        const { obj } = this.props
        return (
            <div className={classes.footer}>
                <div className={classes.buttonContainer}>

                    <button className={classes.footer_btn}
                        onClick={this.default.bind()}>
                        <span >Default</span>
                    </button>

                    <button className={classes.footer_btn} id={classes.savebackground}
                        onClick={this.save.bind(this, obj)}>
                        <span id={`${classes.save}`}  >Save</span>
                    </button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    list: state.settings__filter.data,
    pos_settings: get(state.main, 'pos_settings', {}),
    station: get(state.settings__filter, 'update.station', {}),
    mode: get(state.settings__filter, 'update.mode', {}),
    item: state.item,
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Footer))