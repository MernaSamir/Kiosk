import React, { Component } from 'react'
import { map, get } from 'lodash'
import { withRouter } from 'react-router'
import classes from './style.less'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'

class SizeClass extends Component {

    constructor(props) {
        super(props);
    }

    renderSizes = () => {
        const { units, list } = this.props
        return map(list, (d, key) => (
            <button
                onClick={this.props.addPrice.bind(this, d)}
                key={key}
                className={classes.size_btn}>
                <span> {get(units, d.sales_unit, {}).name} </span>
            </button>
        ))
    }

    renderTopPostion = (position={}) => {
        const { index } = this.props
        if (index < 15) {
            return position.top + 72
        }
        return position.top - 10
    }

    renderLeftPostion = (position={}) => {
        const { index } = this.props
        if ((index >= 3) && (index % 5 == 3 || index % 5 == 4)) {
            return position.left - 138
        }
        return position.left
    }

    render() {
        const { item = {}, list=[], style, position } = this.props
        return ((get(list,'length','') > 1) && <div className={classes.cat_popuptext}
            style={{
                ...style, ...position, top: this.renderTopPostion(position),
                left: this.renderLeftPostion(position)
            }}
            id="cat-Popup" >
            <p> {"Size: "} {item.name} </p>
            <div className={classes.sizes}>
                <div className={classes.holder}>
                    {this.renderSizes()}
                </div>
            </div>
        </div>
        )
    }
}

export const Size = connect((state) => ({
    units: state.dropdowns__units_of_measure.data,
}), mapDispatchToProps)(withRouter(SizeClass));