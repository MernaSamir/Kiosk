import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash';
import applyFilter from 'helpers/functions/filters';
import Form from 'helpers/wrap/form'
import { service } from './fields'
// import FormControl from 'form_control'
import Actions from './actions';
import { withRouter } from 'react-router-dom'
import applyFilters from 'helpers/functions/filters'
import classes from './style.less'
import Render from 'helpers/functions/field_mapper/renderfields'

class ServiceProvider extends Component {

    static onSubmit(props, values) {
        const { setMain, mode, station, shift, location, serve } = props;
        console.log("Values  ", values)
        const data = applyFilters({
            key: 'Find',
            path: 'dropdowns__delivery_service_mode',
            params: {
                service: values.sp,
            }
        })
        let locs = applyFilter({
            path: 'dropdowns__delivery_service',
            key: 'Filter',
            params: {
                service: values.sp
            }
        })
        const list = applyFilter({
            reduxName: 'licensing__location',
            key: 'picking',
            params: {}
        }, locs.map(d => d.location))
        const sub_mode = applyFilters({
            key: 'Find',
            path: 'settings__sub_mode',
            params: {
                key: data.mode,
            }
        })

        setMain('dropdowns__delivery_service', { active: values.sp })
        setMain('orders__main', {
            item: {
                mode: mode.id,
                sub_mode: sub_mode.id,
                station: station.id,
                pick_location: data.mode == 'pickup' ? location : null,
                serve,
                start_time: new Date(),
                sp: values.sp,
                shift,
                action: 'add',
                onSuccess() {
                    if (data.mode == 'delivery') {
                        return [{
                            type: 'set_main_popup',
                            data: { popup: {} }
                        }]
                    }
                    return [{
                        type: 'set_main_popup',
                        data: { popup: { type: 'Location', childProps: { list } } }
                    }]
                }
            },
        })
    }

    getSpList() {
        const { values, location } = this.props;
        // console.log(values,location)
        let locs = applyFilter({
            path: 'dropdowns__delivery_service',
            key: 'Filter',
            params: {
                location: values.location || location
            }
        })
        return applyFilter({
            reduxName: 'delivery_service',
            key: 'picking',
            params: {}
        }, locs.map(d => d.service))
    }

    renderButtons = (sp) => {
        return Render([{
            name: 'sp',
            type: 'selectButtons',
            className: classes.btnsContanier,
            options: sp.options,
        }])
    }

    render() {
        const options = this.getSpList();
        const sp = {
            ...service,
            options
        }
        const { handleSubmit, handleChange, isValid } = this.props;
        return (
            <div className={classes.container}>
                <p className={classes.p}> Choose Service Provider</p>
                {/* {<FormControl {...sp} {...{ handleSubmit, handleChange }} />} */}
                {this.renderButtons(sp)}
                <Actions {...{ handleSubmit, handleChange, isValid }} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    sps: state.dropdowns__delivery_service.data,
    location: state.licensing__location.active,
    station: get(state.licensing__station.data, state.licensing__station.active, {}),
    serve: state.main.current.id,
    shift: state.orders__shifts.active,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form(ServiceProvider)))