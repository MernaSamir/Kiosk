import React, { Component } from 'react'
import classes from '../../../style.less'
import Slider from '@material-ui/lab/Slider';
import { get, find, round } from 'lodash'

export default class SliderRow extends Component {

    state = {
        // value: 0.5,
    }

    static getDerivedStateFromProps(props, state) {
        const { list, mode, station } = props
        if (state.value == undefined || state.mode != mode.id) {
            return {
                value: eval(get(find(list, { mode: mode.id, station: station.id, key: 'fontSize' }), 'value', '')) || 1,
                mode: mode.id,
            }
        }
    }

    handleChange = (event, value) => {
        const { getSettings } = this.props
        this.setState({
            value: round(value, 2)
        }, () => {
            getSettings("fontSize", this.state.value)
        }
        )
    }

    // componentDidMount() {
    //     const { getSettings, pos_settings } = this.props
    //     this.setState({
    //         value: pos_settings.fontSize
    //     })
    // }


    render() {
        const { value } = this.state
        return (
            <div className={classes.sliderPart}>
                <div className={classes.fontsize_div}>
                    <label>Font Size</label>
                    <p>{value}</p>
                </div>

                <Slider
                    classes={{
                        track: classes.slider, thumb: classes.thumb,
                        thumbWrapper: classes.thumbWrapper
                    }}
                    value={value}
                    min={1}
                    max={2}
                    step={0.2}
                    onChange={this.handleChange} />

            </div>
        )
    }
}
