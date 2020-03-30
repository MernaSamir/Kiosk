import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './style.less'
import { find, get } from 'lodash';
import applyFilters from 'helpers/functions/filters'

class actions extends Component {

    startOrder(home) {
        const { handleSubmit, handleChange } = this.props;
        handleChange({
            target: {
                name: 'home',
                value: home
            }
        })
        setTimeout(() => {
            handleSubmit()
        })
    }


    Order = () => {
        const { delivery_service_mode, setMain, chain, mode, handleSubmit } = this.props
        if (delivery_service_mode.mode == "pi") {
            const sub_mode = applyFilters({
                key: 'Find',
                path: 'settings__sub_mode',
                params: {
                    mode,
                    key: 'pickup'
                }
            })
            setMain('settings__sub_mode', { active: sub_mode.id })
            let childProps = {
                path: 'licensing__location',
                params: {
                    chain: chain,
                },
                sub_mode: sub_mode.id,
                filter: 'pick_location'
            }
            setMain('popup', {
                popup: {
                    type: 'Choose', visable: true, width: "50%",
                    childProps
                }
            })
        }
        else{
            setTimeout(() => {
                handleSubmit()
            })
        }

    }

    render() {
        // console.log(this.props.delivery_service_mode)
        return (
            <div className={classes.saveBtns}>
                <button type="button" onClick={this.Order.bind()}>Done</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    delivery_service_mode: find(state.dropdowns__delivery_service_mode.data, { service: 'ot' }),
    chain: state.licensing__chain.active,
    mode: get(state.settings__mode, 'active', ''),
})

export default connect(mapStateToProps, mapDispatchToProps)(actions)