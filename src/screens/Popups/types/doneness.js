import React, { Component } from 'react'
import { map, keys } from 'lodash'
import classes from './style.less'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { withRouter } from 'react-router-dom'
class DonenessClass extends Component {

    renderDoneness = () => {
        const { doneness } = this.props;
        if (keys(doneness).length == 1) {
            this.addDone(keys(doneness)[0])
        }
        else {
            return map(doneness, (d, key) => {
                return <button type="button" className={classes.doneness_btn}
                    key={key} onClick={this.addDone.bind(this, d)}>
                    <span> {d.name} </span>
                </button>
            })
        }
    }

    addDone = (doneness) => {
        const { setAll, isCombo, price, history, customMix } = this.props
        if (isCombo) {
       
            setAll([
                { type: 'set_main', app: 'items__prices', data: { active: price.id } },
                { type: 'set_main', app: 'dropdowns__doneness', data: { active: doneness.id } },
                { type: 'set_main', app: 'popup', data: { active: '' } }
            ])
            history.push('/home/combo')
        }
        else if(customMix){
            setAll([
                { type: 'set_main', app: 'items__prices', data: { active: price.id } },
                { type: 'set_main', app: 'dropdowns__doneness', data: { active: doneness.id } },
                { type: 'set_main', app: 'popup', data: { active: '' } }
            ])
            history.push('/home/custom_mix')
        }
        else {
            // console.log("D & !ss")
            setAll([
                { type: 'set_main', app: 'popup', data: { active: '' } },
                {
                    type: 'append_path', app: 'orders__details', path: 'item',
                    data: { doneness: doneness.id, add: true }
                }
            ])
        }
    }

    renderTopPostion = (position) => {
        const { index } = this.props
        if (index < 15) {
            return position.top + 72
        }
        return position.top - 10
    }

    renderLeftPostion = (position) => {
        const { index } = this.props
        if ((index >= 3) && (index % 5 == 3 || index % 5 == 4)) {
            return position.left - 138
        }
        return position.left
    }

    render() {
        const { item = {}, style, position } = this.props
        return (<div className={classes.cat_popuptext_doneness}
            style={{
                ...style, ...position, top: this.renderTopPostion(position),
                left: this.renderLeftPostion(position)
            }}
            id="cat-Popup" >
            <p> {"Doneness: "} {item.name} </p>
            <div className={classes.sizes}>
                {this.renderDoneness()}
            </div>
        </div>
        )
    }
}


export const Doneness = connect((state) => ({
    doneness: state.dropdowns__doneness.data,
    isCombo: state.popup.isCombo,
    price: state.popup.price,
    customMix: state.popup.customMix
}), mapDispatchToProps)(withRouter(DonenessClass));
